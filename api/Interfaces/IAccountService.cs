using api.Dtos.Account;

namespace api.Interfaces
{
    public interface IAccountService
    {
        Task<bool> SendEmailVerificationAsync(string userId);
        Task<bool> SendPhoneNumberVerificationAsync(string userId);
        Task<bool> VerifyEmailAsync(VerifyAccountDto verifyAccountDto);
        Task<bool> VerifyPhoneNumberAsync(VerifyAccountDto verifyAccountDto);
        Task<bool> LockAccountAsync(LockAccountDto lockAccountDto);
    }
}