using System.Web;
using api.Dtos.Account;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public AccountController(
            IUserService userService,
            IEmailService emailService,
            IConfiguration config)
        {
            _userService = userService;
            _emailService = emailService;
            _config = config;
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logout successful" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userService.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var token = await _userService.GeneratePasswordResetTokenAsync(user);
            var callbackUrl = $"{_config["AppUrl"]}/reset-password?token={HttpUtility.UrlEncode(token)}&email={HttpUtility.UrlEncode(user.Email)}";

            // Send email with the callback URL
            await _emailService.SendPasswordResetEmail(user.Email, callbackUrl);

            return Ok("Password reset email sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userService.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var result = await _userService.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Password has been reset.");
        }
    }
}