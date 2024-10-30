using api.Dtos.Account;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/phone-verification")]
    [ApiController]
    public class PhoneVerificationController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public PhoneVerificationController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [Authorize]
        [HttpPost("send")]
        public async Task<IActionResult> SendPhoneVerification([FromBody] string userId)
        {
            var result = await _accountService.SendPhoneNumberVerificationAsync(userId);
            if (!result) return BadRequest("Failed to send phone verification");
            return Ok();
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPhone([FromBody] VerifyAccountDto verifyAccountDto)
        {
            var result = await _accountService.VerifyPhoneNumberAsync(verifyAccountDto);
            if (!result) return BadRequest("Failed to verify phone number");
            return Ok();
        }
    }
}