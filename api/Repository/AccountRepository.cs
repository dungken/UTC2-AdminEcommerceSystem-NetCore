using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<AppUser> _userManager;

        public AccountRepository(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<AppUser> FindByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(AppUser user)
        {
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<string> GeneratePhoneNumberConfirmationTokenAsync(AppUser user)
        {
            return await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);
        }

        public async Task<bool> ConfirmEmailAsync(AppUser user, string token)
        {
            var result = await _userManager.ConfirmEmailAsync(user, token);
            return result.Succeeded;
        }

        public async Task<bool> ConfirmPhoneNumberAsync(AppUser user, string token)
        {
            var result = await _userManager.ChangePhoneNumberAsync(user, user.PhoneNumber, token);
            return result.Succeeded;
        }

        public async Task<bool> LockAccountAsync(AppUser user, bool lockAccount)
        {
            var lockoutEndDate = lockAccount ? DateTimeOffset.MaxValue : DateTimeOffset.Now;
            var result = await _userManager.SetLockoutEndDateAsync(user, lockoutEndDate);
            return result.Succeeded;
        }
    }
}