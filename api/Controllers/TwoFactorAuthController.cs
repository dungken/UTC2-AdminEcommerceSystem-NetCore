using System.Security.Claims;
using api.Dtos.Account;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/2fa")]
    [ApiController]
    public class TwoFactorAuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IQrCodeService _qrCodeService;
        private readonly ILogger<TwoFactorAuthController> _logger;

        public TwoFactorAuthController(IUserService userService, IQrCodeService qrCodeService, ILogger<TwoFactorAuthController> logger)
        {
            _userService = userService;
            _qrCodeService = qrCodeService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("enable")]
        public async Task<IActionResult> EnableTwoFactorAuthentication()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                      ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("User email claim not found.");
            }

            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Generate a new Base32 secret for the user
            var secret = _qrCodeService.GenerateBase32Secret();
            user.TwoFactorSecret = secret;
            await _userService.UpdateAsync(user); // Save the secret to the database

            // Create the authenticator URI
            var authenticatorUri = _qrCodeService.GenerateQrCodeUri(user.Email, secret);

            // Generate and send QR code email with the URI
            await _qrCodeService.SendTwoFactorSetupEmail(user.Email, authenticatorUri);

            return Ok(new { QrCodeUri = authenticatorUri });
        }

        [Authorize]
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyTwoFactorAuthentication([FromBody] Verify2FaDto verify2FaDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                      ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("User email claim not found.");
            }

            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var secret = user.TwoFactorSecret;
            if (string.IsNullOrEmpty(secret))
            {
                return BadRequest("2FA setup not completed.");
            }

            var isValid = await _userService.VerifyTwoFactorTokenAsync(user, "Authenticator", secret);
            if (!isValid)
            {
                return BadRequest("Invalid 2FA code.");
            }

            _logger.LogInformation("2FA code verified successfully for user: {Email}", email);

            return Ok(new { message = "2FA code verified successfully." });
        }
    }
}