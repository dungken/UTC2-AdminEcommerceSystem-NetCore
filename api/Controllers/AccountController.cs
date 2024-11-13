using System.ComponentModel.DataAnnotations;
using System.Web;
using api.Dtos.Account;
using api.Dtos.User;
using api.Extensions;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using api.Utils;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly ISmsService _smsService;
        private readonly IQRCodeService _qrCodeService;
        private readonly ILogger<AccountController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IVerificationCodeService _verificationCodeService;
        private readonly IPermissionService _permissionService;

        public AccountController(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            SignInManager<User> signInManager,
            IUserService userService,
            IConfiguration configuration,
            IEmailService emailService,
            ISmsService smsService,
            IJwtService jwtService,
            IQRCodeService qrCodeService,
            ILogger<AccountController> logger,
            IHttpClientFactory httpClientFactory,
            IVerificationCodeService verificationCodeService,
            IPermissionService permissionService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userService = userService;
            _configuration = configuration;
            _emailService = emailService;
            _smsService = smsService;
            _jwtService = jwtService;
            _qrCodeService = qrCodeService;
            _logger = logger;
            _signInManager = signInManager;
            _httpClientFactory = httpClientFactory;
            _verificationCodeService = verificationCodeService;
            _permissionService = permissionService;
        }

        // POST: api/Account/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            // Check user is deleted or not
            var deletedUser = await _userManager.FindByEmailAsync(model.Email);
            if (deletedUser != null && deletedUser.IsDeleted)
                return BadRequest(CreateErrorResponse("User account is deleted. Please contact support.", ModelState));

            return await HandleNormalRegistration(model);
        }

        private async Task<IActionResult> HandleNormalRegistration(RegisterUserDto model)
        {
            if (await UserExists(model.UserName, model.Email))
                return BadRequest(CreateErrorResponse("User or Email is already registered, please login!.", ModelState));

            var newUser = CreateUser(model);
            var registrationResult = await _userManager.CreateAsync(newUser, model.Password);

            if (registrationResult.Succeeded)
            {
                await SendConfirmationEmail(newUser);
                return Ok(CreateSuccessResponse("User registered successfully! Please check your email to confirm your account."));
            }

            return HandleIdentityErrors(registrationResult.Errors);
        }

        // POST: api/Account/ConfirmEmail
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(CreateErrorResponse("Invalid email address.", ModelState));

            return await ConfirmUserEmail(user, model.Token);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto model)
        {
            // Validate model state
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            // Attempt to find the user by email or username
            var user = await FindUserByEmailOrUsername(model.EmailOrUsername);
            if (user == null)
                return Unauthorized(CreateErrorResponse("User not found."));

            // Check if user account is deleted
            if (user.IsDeleted)
                return Unauthorized(CreateErrorResponse("User account is deleted."));

            // Check if the email is confirmed
            if (!await IsEmailConfirmed(user))
                return Unauthorized(CreateErrorResponse("Email not confirmed. Please check your email to confirm your account."));

            // Verify user password
            if (!await IsPasswordValid(user, model.Password))
                return Unauthorized(CreateErrorResponse("Invalid authentication attempt."));

            // Check if two-factor authentication is enabled
            if (user.TwoFactorEnabled)
            {
                // Generate and send verification code for 2FA
                var code = GenerateRandomCodeUtil.GenerateRandomCode();
                await _verificationCodeService.StoreVerificationCodeAsync(user.Id.ToString(), code);
                await _emailService.SendVerificationCodeEmailAsync(user.Email, code);

                return Ok(new
                {
                    TwoFactorEnabled = true,
                    Status = "success",
                    Message = "Two-factor authentication is enabled. A verification code has been sent."
                });
            }

            // If 2FA is not enabled, proceed with generating the JWT token
            var roles = await _userService.GetUserRolesAsync(user); // Fetch roles as a list of Guid
            Console.WriteLine("Roles: ");
            foreach (var role in roles)
            {
                Console.WriteLine(role);
            }
            var permissions = await _permissionService.GetPermissionsAsync(user.Id); // Fetch permissions
            Console.WriteLine("Permissions: ");
            var permissionIds = permissions.Select(p => p.PermissionId).ToList(); // List of permission Guids
            foreach (var permission in permissions)
            {
                Console.WriteLine(permission);
            }

            // Generate the JWT token with roles and permissions
            var token = await _jwtService.GenerateJwtTokenAsync(user, roles, permissionIds);
            Console.WriteLine("Token: " + token);

            return Ok(new
            {
                data = new
                {
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.UserName,
                        user.Email,
                        Role = roles
                    }
                },
                Status = "success",
                Message = "Login successful."
            });
        }




        // POST: api/Account/Logout
        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            // JWT is stateless, so logout can be handled on the client side by deleting the token
            return Ok(new { Message = "User logged out successfully!" });
        }

        // GET: api/Account/Enable2FA
        [HttpGet("Enable2FA")]
        public async Task<IActionResult> Enable2FA()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("User not found. Please try again!", ModelState));

            var code = GenerateRandomCodeUtil.GenerateRandomCode();
            await _verificationCodeService.StoreVerificationCodeAsync(user.Id.ToString(), code);
            await _emailService.SendVerificationCodeEmailAsync(user.Email, code);

            return Ok(new { status = "success", message = "Verification code has been sent to your email. Expires in 5 minutes!" });
        }

        // POST: api/Account/Verify2FA
        [HttpPost("Verify2FA")]
        public async Task<IActionResult> Verify2FA([FromBody] Verify2FADto model)
        {
            // Validate model state
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            // Ensure the verification code is a 6-digit number
            if (string.IsNullOrWhiteSpace(model.VerifyCode) || model.VerifyCode.Length != 6 || !int.TryParse(model.VerifyCode, out _))
                return BadRequest(CreateErrorResponse("Invalid verification code. Please enter a 6-digit code.", ModelState));

            var user = await GetUserFromTokenAsync();

            if (!string.IsNullOrEmpty(model.UserId))
                user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
                return Unauthorized(CreateErrorResponse("User not found. Please try again!", ModelState));

            var storedCode = await _verificationCodeService.GetVerificationCodeAsync(user.Id.ToString());

            if (string.IsNullOrEmpty(storedCode))
                return BadRequest(CreateErrorResponse("No verification code found. Please request a new code.", ModelState));

            // Check if the provided verification code matches the stored one
            if (model.VerifyCode == storedCode)
            {
                // If 2FA is being verified during login
                if (!user.TwoFactorEnabled)
                {
                    user.TwoFactorEnabled = true; // Enable 2FA for the user
                }

                var updateResult = await _userManager.UpdateAsync(user); // Update the user information in the database

                if (updateResult.Succeeded)
                    return Ok(new { status = "success", message = "2FA verified successfully!" });
                else
                    return BadRequest(CreateErrorResponse("Failed to update user information. Please try again.", ModelState));
            }
            else
                return BadRequest(CreateErrorResponse("Invalid verification code. Please try again.", ModelState));
        }


        // POST: api/Account/Disable2FA
        [HttpGet("Disable2FA")]
        public async Task<IActionResult> Disable2FA()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("User not found. Please try again!", ModelState));

            // Disable 2FA in the Identity user
            user.TwoFactorEnabled = false; // This property is part of IdentityUser
            var result = await _userManager.UpdateAsync(user); // Use UserManager to update the user

            if (result.Succeeded)
                return Ok(new { status = "success", message = "2FA disabled successfully!" });
            else
                return BadRequest(CreateErrorResponse("Failed to disable 2FA. Please try again.", ModelState));
        }

        // GET: api/Account/TwoFAStatus
        [HttpGet("TwoFAStatus")]
        public async Task<IActionResult> GetTwoFAStatus()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("User not found. Please try again!", ModelState));

            // Check the TwoFactorEnabled property
            bool isTwoFAEnabled = user.TwoFactorEnabled;

            return Ok(new { isTwoFAEnabled });
        }



        // POST: api/Account/ForgotPassword
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                _logger.LogWarning("User not found for email: {Email}", model.Email);
                return NotFound(CreateErrorResponse("User not found for email.", ModelState));
            }

            var resetToken = await GeneratePasswordResetTokenAsync(user);
            var resetLink = CreatePasswordResetLink(resetToken, user.Email);

            await SendPasswordResetEmailAsync(user.Email, resetLink);

            return Ok(new { status = "success", message = "Password reset link has been sent to your email." });
        }

        // POST: api/Account/ResetPassword
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(CreateErrorResponse("Invalid request.", ModelState));

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded)
            {
                await ConfirmEmailAsync(user);
                return Ok(new { status = "success", message = "Password has been reset successfully." });
            }

            return BadRequest(CreateErrorResponse("Failed to reset password.", ModelState));
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(CreateErrorResponse("Invalid input data.", ModelState));

            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("Invalid token or user not found."));

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
                return Ok(new { status = "success", message = "Password changed successfully." });

            return BadRequest(CreateErrorResponse("Failed to change password.", result.Errors));
        }

        // POST: api/Account/SocialLogin
        [HttpPost("SocialLogin")]
        public async Task<IActionResult> SocialLogin([FromBody] SocialLoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                User user = await GetOrCreateUserAsync(model);
                if (user == null)
                    return BadRequest(CreateErrorResponse("Failed to create or retrieve user."));

                // Check if user account is deleted
                if (user.IsDeleted)
                    return Unauthorized(CreateErrorResponse("User account is deleted.", ModelState));

                var roles = await _userService.GetUserRolesAsync(user);
                var permissions = await _permissionService.GetPermissionsAsync(user.Id);
                var permissionIds = permissions.Select(p => p.PermissionId).ToList();
                var token = await _jwtService.GenerateJwtTokenAsync(user, roles, permissionIds);

                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.UserName,
                        user.Email,
                        Role = roles
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("Token verification failed: {Error}", ex.Message);
                return Unauthorized(new { Message = "Invalid token." });
            }
        }

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
                AddErrorsToModelState(result.Errors);
                return null;
            }
            await AssignUserRole(user);

            return user;
        }

        private async Task<User> CreateFacebookUser(FacebookUser fbUser)
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
                AddErrorsToModelState(result.Errors);
                return null;
            }
            await AssignUserRole(user);

            return user;
        }


        // Helper Methods
        private async Task<User> GetUserFromTokenAsync()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var userName = _jwtService.GetUserNameFromToken(token);
            return userName != null ? await _userManager.FindByNameAsync(userName) : null;
        }

        private object CreateErrorResponse(string message, IEnumerable<IdentityError> errors = null)
        {
            return new
            {
                status = "error",
                message,
                errors = errors?.Select(e => e.Description) ?? null
            };
        }


        private User CreateUser(RegisterUserDto model)
        {
            return new User
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };
        }

        private async Task<bool> UserExists(string username, string email)
        {
            return await _userManager.FindByNameAsync(username) != null || await _userManager.FindByEmailAsync(email) != null;
        }

        private async Task SendConfirmationEmail(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token);
            var confirmationLink = $"{_configuration["ClientAppUrl"]}/confirm-email?token={encodedToken}&email={user.Email}";

            await _emailService.SendEmailAsync(user.Email, "Confirm your email", $"Please confirm your email by clicking here: {confirmationLink}");
        }

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

        private async Task<object> GenerateLoginResponse(User user)
        {
            var roles = _userService.GetUserRolesAsync(user).Result; // Fetch roles synchronously for simplicity
            var permissions = await _permissionService.GetPermissionsAsync(user.Id);
            var permissionIds = permissions.Select(p => p.PermissionId).ToList();
            var token = await _jwtService.GenerateJwtTokenAsync(user, roles, permissionIds);

            return new
            {
                status = "success",
                message = "Login successful.",
                data = new
                {
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.UserName,
                        user.Email,
                        Role = roles
                    }
                }
            };
        }

        private async Task<IActionResult> ConfirmUserEmail(User user, string token)
        {
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
                return HandleIdentityErrors(result.Errors);

            return await AssignUserRole(user);
        }

        private async Task<IActionResult> AssignUserRole(User user)
        {
            const string roleName = "User"; // Tên vai trò cần gán
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new Role { Name = roleName });
            }

            var addToRoleResult = await _userManager.AddToRoleAsync(user, roleName);
            if (!addToRoleResult.Succeeded)
            {
                return HandleIdentityErrors(addToRoleResult.Errors);
            }

            return Ok(new { status = "success", message = "Email confirmed successfully and user added to role!" });
        }

        private IActionResult HandleIdentityErrors(IEnumerable<IdentityError> errors)
        {
            foreach (var error in errors)
                ModelState.AddModelError(string.Empty, error.Description);

            return BadRequest(new { status = "error", message = "Operation failed.", errors = ModelState });
        }



        private void AddErrorsToModelState(IEnumerable<IdentityError> errors)
        {
            foreach (var error in errors)
                ModelState.AddModelError(string.Empty, error.Description);
        }

        private async Task<FacebookUser> GetFacebookUserAsync(string accessToken)
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://graph.facebook.com/me?access_token={accessToken}&fields=id,name,email,first_name,last_name");
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<FacebookUser>();
        }

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

        private async Task ConfirmEmailAsync(User user)
        {
            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);
        }

        private object CreateSuccessResponse(string message) => Ok(new { status = "success", message });
        private object CreateErrorResponse(string message, ModelStateDictionary errors) => Ok(new { status = "error", message, errors = errors });

        // Helper Methods
        private async Task<User> GetUserAsync()
        {
            return await _userManager.GetUserAsync(User);
        }

        private async Task<IdentityResult> SetUserPhoneNumberAsync(User user, string phoneNumber)
        {
            return await _userManager.SetPhoneNumberAsync(user, phoneNumber);
        }

        private async Task<string> GenerateAndSendVerificationCodeAsync(User user)
        {
            var code = await _userManager.GenerateTwoFactorTokenAsync(user, "Phone");
            var message = $"Your verification code is {code}";
            await _smsService.SendSmsAsync(user.PhoneNumber, message);
            return code;
        }

        private async Task<User> GetCurrentUserAsync()
        {
            var username = User.GetUsername();
            return username != null ? await _userManager.FindByNameAsync(username) : null;
        }

        private byte[] GenerateQrCodeImage(string email, string key)
        {
            var qrCodeUri = _qrCodeService.GenerateQrCodeUri(email, key);
            return _qrCodeService.GenerateQrCodeImage(qrCodeUri);
        }

        private async Task SendTwoFactorSetupEmailAsync(string email, byte[] qrCodeImage)
        {
            var subject = "Two Factor Authentication For Your Account";
            var message = "Scan the attached QR code with your authenticator app.";
            await _emailService.SendEmailAsync(email, subject, message, qrCodeImage);
        }

    }

}