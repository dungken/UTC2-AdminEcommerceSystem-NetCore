using api.Models;

namespace api.Interfaces
{
    public interface IAccountRepository
    {
        Task<AppUser> FindByIdAsync(string userId);
        Task<string> GenerateEmailConfirmationTokenAsync(AppUser user);
        Task<string> GeneratePhoneNumberConfirmationTokenAsync(AppUser user);
        Task<bool> ConfirmEmailAsync(AppUser user, string token);
        Task<bool> ConfirmPhoneNumberAsync(AppUser user, string token);
        Task<bool> LockAccountAsync(AppUser user, bool lockAccount);
    }
}