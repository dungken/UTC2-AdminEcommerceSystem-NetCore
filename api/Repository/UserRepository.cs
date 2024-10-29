using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public UserRepository(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<AppUser> FindByLoginAsync(string loginProvider, string providerKey)
        {
            var user = await _userManager.FindByLoginAsync(loginProvider, providerKey);
            return user ?? throw new InvalidOperationException("User not found.");
        }

        public async Task<AppUser?> FindByEmailAsync(string email)
        {
            return await _userManager.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IdentityResult> CreateAsync(AppUser user)
        {
            return await _userManager.CreateAsync(user);
        }

        public async Task<IdentityResult> CreateAsync(AppUser user, string password)
        {
            return await _userManager.CreateAsync(user, password);
        }

        public async Task<IdentityResult> AddLoginAsync(AppUser user, UserLoginInfo info)
        {
            return await _userManager.AddLoginAsync(user, info);
        }

        public async Task<AppUser> FindByUsernameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<IdentityResult> AddToRoleAsync(AppUser user, string role)
        {
            return await _userManager.AddToRoleAsync(user, role);
        }

        public async Task<bool> CheckPasswordAsync(AppUser user, string password)
        {
            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            return result.Succeeded;
        }

        public async Task<IdentityResult> UpdateAsync(AppUser user)
        {
            return await _userManager.UpdateAsync(user);
        }

        public async Task<IdentityResult> ChangePasswordAsync(AppUser user, string currentPassword, string newPassword)
        {
            return await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        }

        Task<IdentityResult> IUserRepository.AddLoginAsync(AppUser user, UserLoginInfo info)
        {
            return AddLoginAsync(user, info);
        }

        public async Task<string> GeneratePasswordResetTokenAsync(AppUser user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<IdentityResult> ResetPasswordAsync(AppUser user, string token, string newPassword)
        {
            return await _userManager.ResetPasswordAsync(user, token, newPassword);
        }

        public async Task<IdentityResult> UpdateUserAsync(AppUser user)
        {
            return await _userManager.UpdateAsync(user);
        }

        public async Task<bool> VerifyTwoFactorTokenAsync(AppUser user, string tokenProvider, string token)
        {
            return await _userManager.VerifyTwoFactorTokenAsync(user, tokenProvider, token);
        }
    }
}
