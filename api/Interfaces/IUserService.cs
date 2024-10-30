using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Interfaces
{
    public interface IUserService
    {
        Task<AppUser> FindByUsernameAsync(string username);
        Task<bool> CheckPasswordAsync(AppUser user, string password);
        Task<IdentityResult> CreateAsync(AppUser user, string password);
        Task<IdentityResult> AddToRoleAsync(AppUser user, string role);
        Task<AppUser> FindByLoginAsync(string loginProvider, string providerKey);
        Task<AppUser> FindByEmailAsync(string email);
        Task<IdentityResult> AddLoginAsync(AppUser user, UserLoginInfo info);
        Task<IdentityResult> UpdateAsync(AppUser user);
        Task<IdentityResult> ChangePasswordAsync(AppUser user, string currentPassword, string newPassword);
        Task<string> GeneratePasswordResetTokenAsync(AppUser user);
        Task<IdentityResult> ResetPasswordAsync(AppUser user, string token, string newPassword);
        Task<bool> VerifyTwoFactorTokenAsync(AppUser user, string tokenProvider, string token);
        Task<IdentityResult> UpdateUserAsync(AppUser user);
        Task<IdentityResult> CreateAsync(AppUser user);
    }

}