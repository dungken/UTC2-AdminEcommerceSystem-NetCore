using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Interfaces
{
    public interface IUserRepository
    {
        Task<IdentityResult> AddLoginAsync(AppUser user, UserLoginInfo info);
        Task<IdentityResult> AddToRoleAsync(AppUser user, string role);
        Task<IdentityResult> ChangePasswordAsync(AppUser user, string currentPassword, string newPassword);
        Task<bool> CheckPasswordAsync(AppUser user, string password);
        Task<IdentityResult> CreateAsync(AppUser user, string password);
        Task<IdentityResult> CreateAsync(AppUser user);
        Task<AppUser> FindByEmailAsync(string email);
        Task<AppUser> FindByLoginAsync(string loginProvider, string providerKey);
        Task<AppUser> FindByUsernameAsync(string username);
        Task<string> GeneratePasswordResetTokenAsync(AppUser user);
        Task<IdentityResult> ResetPasswordAsync(AppUser user, string token, string newPassword);
        Task<IdentityResult> UpdateAsync(AppUser user);
        Task<IdentityResult> UpdateUserAsync(AppUser user);
        Task<bool> VerifyTwoFactorTokenAsync(AppUser user, string tokenProvider, string token);
    }
}