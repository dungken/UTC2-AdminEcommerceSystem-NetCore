using api.Dtos.Account;
using api.Interfaces;
using api.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;


namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly ITokenService _tokenService;

        public AuthenticationController(IUserService userService, ITokenService tokenService, IRoleService roleService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _roleService = roleService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userService.FindByUsernameAsync(loginDto.Username);
            if (user == null) return Unauthorized("Invalid username!");

            var isPasswordValid = await _userService.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid) return Unauthorized("Username not found and/or password incorrect");

            var roles = await _roleService.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            return Ok(new NewUserDto
            {
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Token = token
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appUser = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };

            var result = await _userService.CreateAsync(appUser, registerDto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var roleResult = await _userService.AddToRoleAsync(appUser, "User");
            if (!roleResult.Succeeded)
                return BadRequest(roleResult.Errors);

            var roles = await _roleService.GetRolesAsync(appUser);
            var token = _tokenService.CreateToken(appUser, roles);

            return Ok(new NewUserDto
            {
                UserName = appUser.UserName,
                Email = appUser.Email,
                Token = token
            });
        }

        [HttpPost("externallogin")]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalLoginDto externalLoginDto)
        {
            object? payload = null;
            if (externalLoginDto.Provider == "Google")
            {
                payload = await _tokenService.VerifyGoogleToken(externalLoginDto.IdToken);
            }
            else if (externalLoginDto.Provider == "Facebook")
            {
                payload = await _tokenService.VerifyFacebookToken(externalLoginDto.IdToken);
            }

            if (payload == null)
            {
                return BadRequest("Invalid External Authentication.");
            }

            string userId = string.Empty;
            string email = string.Empty;

            if (payload is GoogleJsonWebSignature.Payload googlePayload)
            {
                userId = googlePayload.Subject;
                email = googlePayload.Email;
            }
            else if (payload is JObject facebookPayload)
            {
                userId = facebookPayload["id"]?.ToString() ?? string.Empty;
                email = facebookPayload["email"]?.ToString() ?? string.Empty;
            }
            else
            {
                return BadRequest("Invalid External Authentication.");
            }

            var info = new UserLoginInfo(externalLoginDto.Provider, userId, externalLoginDto.Provider);
            var user = await _userService.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
            {
                user = await _userService.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new AppUser { Email = email, UserName = email };
                    await _userService.CreateAsync(user);
                    await _userService.AddLoginAsync(user, info);
                }
                else
                {
                    await _userService.AddLoginAsync(user, info);
                }
            }

            var roles = await _roleService.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            return Ok(new { token });
        }
    }
}