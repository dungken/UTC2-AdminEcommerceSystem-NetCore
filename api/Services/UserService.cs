using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IdentityResult> AddLoginAsync(AppUser user, UserLoginInfo info)
        {
            return await _userRepository.AddLoginAsync(user, info);
        }

        public async Task<IdentityResult> AddToRoleAsync(AppUser user, string role)
        {
            return await _userRepository.AddToRoleAsync(user, role);
        }

        public async Task<IdentityResult> ChangePasswordAsync(AppUser user, string currentPassword, string newPassword)
        {
            return await _userRepository.ChangePasswordAsync(user, currentPassword, newPassword);
        }

        public async Task<bool> CheckPasswordAsync(AppUser user, string password)
        {
            return await _userRepository.CheckPasswordAsync(user, password);
        }

        public async Task<IdentityResult> CreateAsync(AppUser user, string password)
        {
            return await _userRepository.CreateAsync(user, password);
        }

        public async Task<IdentityResult> CreateAsync(AppUser user)
        {
            return await _userRepository.CreateAsync(user);
        }

        public async Task<AppUser> FindByEmailAsync(string email)
        {
            return await _userRepository.FindByEmailAsync(email);
        }

        public async Task<AppUser> FindByLoginAsync(string loginProvider, string providerKey)
        {
            return await _userRepository.FindByLoginAsync(loginProvider, providerKey);
        }

        public async Task<AppUser> FindByUsernameAsync(string username)
        {
            return await _userRepository.FindByUsernameAsync(username);
        }

        public async Task<string> GeneratePasswordResetTokenAsync(AppUser user)
        {
            return await _userRepository.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<IdentityResult> ResetPasswordAsync(AppUser user, string token, string newPassword)
        {
            return await _userRepository.ResetPasswordAsync(user, token, newPassword);
        }

        public async Task<IdentityResult> UpdateAsync(AppUser user)
        {
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<IdentityResult> UpdateUserAsync(AppUser user)
        {
            return await _userRepository.UpdateUserAsync(user);
        }

        public async Task<bool> VerifyTwoFactorTokenAsync(AppUser user, string tokenProvider, string token)
        {
            return await _userRepository.VerifyTwoFactorTokenAsync(user, tokenProvider, token);
        }
    }
}