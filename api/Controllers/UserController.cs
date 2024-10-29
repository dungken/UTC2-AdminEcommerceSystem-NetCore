using System.Security.Claims;
using api.Dtos.Account;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetPersonalInfo()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                      ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid user identity.");
            }

            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userInfo = new
            {
                user.Email,
                user.UserName,
                user.PhoneNumber
            };

            return Ok(userInfo);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdatePersonalInfo([FromBody] UpdatePersonalInfoDto updatePersonalInfoDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                      ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid user identity.");
            }

            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.UserName = updatePersonalInfoDto.UserName;
            user.PhoneNumber = updatePersonalInfoDto.PhoneNumber;

            var result = await _userService.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Personal information updated successfully." });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                      ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid user identity.");
            }

            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userService.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Password changed successfully." });
        }
    }
}