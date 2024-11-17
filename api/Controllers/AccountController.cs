using System.ComponentModel.DataAnnotations;
using System.Web;
using api.Dtos.Account;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using api.Utils;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AccountController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IVerificationCodeService _verificationCodeService;
        private readonly IPermissionService _permissionService;
        private readonly IBaseReponseService _baseResponseService;

        public AccountController(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            IUserService userService,
            IConfiguration configuration,
            IEmailService emailService,
            IJwtService jwtService,
            ILogger<AccountController> logger,
            IHttpClientFactory httpClientFactory,
            IVerificationCodeService verificationCodeService,
            IPermissionService permissionService,
            IBaseReponseService baseReponseService
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userService = userService;
            _configuration = configuration;
            _emailService = emailService;
            _jwtService = jwtService;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _verificationCodeService = verificationCodeService;
            _permissionService = permissionService;
            _baseResponseService = baseReponseService;
        }

        //////////////// api/Account/Login ////////////////
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto model)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            // Attempt to find the user by email or username
            var user = await FindUserByEmailOrUsername(model.EmailOrUsername);
            if (user == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User not found."));
            }

            // Check if user account is deleted
            if (user.IsDeleted)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User account is deleted."));
            }

            // Check if the email is confirmed
            if (!await IsEmailConfirmed(user))
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("Email not confirmed. Please check your email to confirm your account."));
            }

            // Verify user password
            if (!await IsPasswordValid(user, model.Password))
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("Invalid authentication attempt."));
            }

            var roles = await _userService.GetUserRolesAsync(user);
            var permissions = await _permissionService.GetPermissionsAsync(user.Id);
            var permissionIds = permissions.Select(p => p.PermissionId).ToList();

            // Generate the JWT token with roles and permissions
            var token = await _jwtService.GenerateJwtTokenAsync(user, roles, permissionIds);

            // Check if two-factor authentication is enabled
            if (user.TwoFactorEnabled)
            {
                var code = GenerateRandomCodeUtil.GenerateRandomCode();
                await _verificationCodeService.StoreVerificationCodeAsync(user.Id.ToString(), code);
                await _emailService.SendVerificationCodeEmailAsync(user.Email, code);

                return Ok(_baseResponseService.CreateSuccessResponse(
                    new
                    {
                        TwoFactorEnabled = true,
                        UserId = user.Id,
                        Token = token
                    },
                    "Two-factor authentication is enabled. A verification code has been sent.")
                );
            }


            // _logger.LogInformation("Token generated for user: ", token);

            // Return success response with token and user data
            return Ok(_baseResponseService.CreateSuccessResponse(
                new
                {
                    Token = token,
                    User = user
                },
            "Login successful."));
        }

        //-------------- Helper Methods ---------------//
        private async Task<User> FindUserByEmailOrUsername(string emailOrUsername)
        {
            return new EmailAddressAttribute().IsValid(emailOrUsername)
                ? await _userManager.FindByEmailAsync(emailOrUsername)
                : await _userManager.FindByNameAsync(emailOrUsername);
        }
        private async Task<bool> IsEmailConfirmed(User user)
        {
            return await _userManager.IsEmailConfirmedAsync(user);
        }
        private async Task<bool> IsPasswordValid(User user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }



        //////////////// api/Account/Register ////////////////
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            // Check user is deleted or not
            var deletedUser = await _userManager.FindByEmailAsync(model.Email);
            if (deletedUser != null && deletedUser.IsDeleted)
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("User account is deleted. Please contact support."));

            return await HandleNormalRegistration(model);
        }

        //-------------- Helper Methods ---------------//
        private async Task<IActionResult> HandleNormalRegistration(RegisterUserDto model)
        {
            if (await _userService.IsUserExistingAsync(model.Email, model.UserName))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("User already exists. Please login."));
            }

            var newUser = new User
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var registrationResult = await _userManager.CreateAsync(newUser, model.Password);

            if (!registrationResult.Succeeded)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Failed to register user.", registrationResult.Errors));
            }

            await SendConfirmationEmail(newUser);
            return Ok(_baseResponseService.CreateSuccessResponse(newUser, "User registered successfully! Please check your email to confirm your account."));
        }
        private async Task SendConfirmationEmail(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token);
            var confirmationLink = $"{_configuration["ClientAppUrl"]}/confirm-email?token={encodedToken}&email={user.Email}";

            await _emailService.SendEmailAsync(user.Email, "Confirm your email", $"Please confirm your email by clicking here: {confirmationLink}");
        }



        //////////////// api/Account/ConfirmEmail ////////////////
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Email not found."));
            }

            return await ConfirmUserEmail(user, model.Token);
        }

        //-------------- Helper Methods ---------------//
        private async Task<IActionResult> ConfirmUserEmail(User user, string token)
        {
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Failed to confirm email.", result.Errors));
            }

            return await AssignUserRole(user);
        }
        private async Task<IActionResult> AssignUserRole(User user)
        {
            const string roleName = "Customer";
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new Role { Name = roleName });
            }

            var addToRoleResult = await _userManager.AddToRoleAsync(user, roleName);
            if (!addToRoleResult.Succeeded)
            {
                return (IActionResult)_baseResponseService.CreateModelStateErrorResponse("Failed to add user to role.", addToRoleResult.Errors);
            }

            return Ok(_baseResponseService.CreateSuccessResponse<object>(user, "Email confirmed successfully."));
        }



        //////////////// api/Account/Logout ////////////////
        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            // JWT is stateless, so logout can be handled on the client side by deleting the token
            return Ok(new { Message = "User logged out successfully!" });
        }



        //////////////// api/Account/SocialLogin ////////////////
        [HttpPost("SocialLogin")]
        public async Task<IActionResult> SocialLogin([FromBody] SocialLoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            try
            {
                User user = await GetOrCreateUserAsync(model);
                if (user == null)
                {
                    return BadRequest(_baseResponseService.CreateErrorResponse<object>("Failed to create or retrieve user."));
                }

                // Check if user account is deleted
                if (user.IsDeleted)
                {
                    return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User account is deleted."));
                }

                var roles = await _userService.GetUserRolesAsync(user);
                var permissions = await _permissionService.GetPermissionsAsync(user.Id);
                var permissionIds = permissions.Select(p => p.PermissionId).ToList();
                var token = await _jwtService.GenerateJwtTokenAsync(user, roles, permissionIds);

                return Ok(_baseResponseService.CreateSuccessResponse(
                    new
                    {
                        Token = token,
                        User = user
                    }, "Login successful."
                ));
            }
            catch (Exception ex)
            {
                _logger.LogError("Token verification failed: {Error}", ex.Message);
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("Token verification failed."));
            }
        }

        //-------------- Helper Methods ---------------//
        private async Task<User> GetOrCreateUserAsync(SocialLoginDto model)
        {
            User user = null;

            if (model.Provider == "Google")
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(model.AccessToken);
                string userEmail = payload.Email;

                user = await _userManager.FindByEmailAsync(userEmail) ?? await CreateGoogleUser(payload, userEmail);
            }
            else if (model.Provider == "Facebook")
            {
                var fbUser = await GetFacebookUserAsync(model.AccessToken);
                user = await _userManager.FindByEmailAsync(fbUser.Email) ?? await CreateFacebookUser(fbUser);
            }

            return user;
        }
        private async Task<User> CreateGoogleUser(GoogleJsonWebSignature.Payload payload, string email)
        {
            var user = new User
            {
                UserName = email,
                Email = email,
                FirstName = payload.GivenName ?? email,
                LastName = payload.FamilyName ?? email
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return null;
            }

            await AssignUserRole(user);
            return user;
        }
        private async Task<FacebookUserDto> GetFacebookUserAsync(string accessToken)
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://graph.facebook.com/me?access_token={accessToken}&fields=id,name,email,first_name,last_name");
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<FacebookUserDto>();
        }
        private async Task<User> CreateFacebookUser(FacebookUserDto fbUser)
        {
            var user = new User
            {
                UserName = fbUser.Email,
                Email = fbUser.Email,
                FirstName = fbUser.FirstName ?? fbUser.Email,
                LastName = fbUser.LastName ?? fbUser.Email
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return null;
            }

            await AssignUserRole(user);
            return user;
        }



        //////////////// api/Account/Enable2FA ////////////////
        [HttpGet("Enable2FA")]
        public async Task<IActionResult> Enable2FA()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User not found. Please try again!"));
            }

            var code = GenerateRandomCodeUtil.GenerateRandomCode();
            await _verificationCodeService.StoreVerificationCodeAsync(user.Id.ToString(), code);
            await _emailService.SendVerificationCodeEmailAsync(user.Email, code);

            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new { TwoFactorEnabled = true, VerificationCode = code },
                "2FA enabled successfully. A verification code has been sent."
            ));
        }



        //////////////// api/Account/Verify2FA ////////////////
        [HttpPost("Verify2FA")]
        public async Task<IActionResult> Verify2FA([FromBody] Verify2FADto model)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            // Ensure the verification code is a 6-digit number
            if (string.IsNullOrWhiteSpace(model.VerifyCode) || model.VerifyCode.Length != 6 || !int.TryParse(model.VerifyCode, out _))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid verification code. Please enter a 6-digit code."));
            }

            // Case: User is logged in (2FA setup)
            var user = await GetUserFromTokenAsync();
            // Case: User is not logged in (2FA verification during login)
            if (!string.IsNullOrEmpty(model.UserId))
            {
                user = await _userManager.FindByIdAsync(model.UserId);
            }

            if (user == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User not found. Please try again!"));
            }

            // Get the stored verification code
            var storedCode = await _verificationCodeService.GetVerificationCodeAsync(user.Id.ToString());

            if (string.IsNullOrEmpty(storedCode))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("No verification code found. Please request a new code."));
            }

            // Verify the code
            if (model.VerifyCode != storedCode)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid verification code. Please try again."));
            }

            // Update the user's 2FA status
            if (!user.TwoFactorEnabled)
            {
                user.TwoFactorEnabled = true; // Enable 2FA for the user
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Failed to update user information. Please try again."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new
                {
                    TwoFactorEnabled = true
                },
                "2FA enabled successfully.")
            );
        }



        //////////////// api/Account/Disable2FA ////////////////
        [HttpGet("Disable2FA")]
        public async Task<IActionResult> Disable2FA()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User not found. Please try again!"));
            }

            // Disable 2FA in the Identity user
            user.TwoFactorEnabled = false; // This property is part of IdentityUser
            var result = await _userManager.UpdateAsync(user); // Use UserManager to update the user

            if (!result.Succeeded)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Failed to disable 2FA. Please try again."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new { TwoFactorEnabled = false },
                "2FA disabled successfully.")
            );
        }



        //////////////// api/Account/TwoFAStatus ////////////////
        [HttpGet("TwoFAStatus")]
        public async Task<IActionResult> GetTwoFAStatus()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User not found. Please try again!"));
            }

            // Check the TwoFactorEnabled property
            bool isTwoFAEnabled = user.TwoFactorEnabled;

            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new { TwoFactorEnabled = isTwoFAEnabled },
                "2FA status retrieved successfully.")
            );
        }



        //////////////// api/Account/ForgotPassword ////////////////
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            Console.WriteLine("Email sent is: " + model.Email);

            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("User not found for email."));
            }

            var resetToken = await GeneratePasswordResetTokenAsync(user);
            var resetLink = CreatePasswordResetLink(resetToken, user.Email);

            await SendPasswordResetEmailAsync(user.Email, resetLink);

            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new
                {
                    Email = user.Email,
                    ResetLink = resetLink
                },
                "Password reset link sent successfully."
            ));
        }

        //-------------- Helper Methods ---------------//
        private async Task<string> GeneratePasswordResetTokenAsync(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return HttpUtility.UrlEncode(token);
        }
        private string CreatePasswordResetLink(string resetToken, string email)
        {
            return $"{_configuration["ClientAppUrl"]}/reset-password?token={resetToken}&email={email}";
        }
        private async Task SendPasswordResetEmailAsync(string email, string resetLink)
        {
            await _emailService.SendEmailAsync(email, "Reset Password", $"Please reset your password by clicking here: {resetLink}");
        }



        //////////////// api/Account/ResetPassword ////////////////
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("User not found for email."));
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Failed to reset password.", result.Errors));
            }

            await ConfirmEmailAsync(user);
            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new { Email = user.Email },
                 "Password reset successfully."
            ));
        }

        //-------------- Helper Methods ---------------//
        private async Task ConfirmEmailAsync(User user)
        {
            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);
        }


        //////////////// api/Account/ChangePassword ////////////////
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            Console.WriteLine("Current Password: " + model.CurrentPassword);
            Console.WriteLine("New Password: " + model.NewPassword);
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Invalid input data.", ModelState));
            }

            Console.WriteLine("User from token: " + await GetUserFromTokenAsync());

            var user = await GetUserFromTokenAsync();
            if (user == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("User not found."));
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(_baseResponseService.CreateModelStateErrorResponse("Incorrect current password.", result.Errors));
            }

            return Ok(_baseResponseService.CreateSuccessResponse<object>(
                new { Email = user.Email },
                "Password changed successfully."
            ));
        }



        //========== Helper Methods ==========//
        private async Task<User> GetUserFromTokenAsync()
        {
            return await _jwtService.GetUserFromTokenAsync();
        }
    }
}