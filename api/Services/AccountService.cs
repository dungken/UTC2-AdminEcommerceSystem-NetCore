
using api.Dtos.Account;
using api.Interfaces;

namespace api.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;

        public AccountService(IAccountRepository accountRepository, IEmailService emailService, ISmsService smsService)
        {
            _accountRepository = accountRepository;
            _emailService = emailService;
            _smsService = smsService;
        }

        public async Task<bool> SendEmailVerificationAsync(string userId)
        {
            var user = await _accountRepository.FindByIdAsync(userId);
            if (user == null) return false;

            var token = await _accountRepository.GenerateEmailConfirmationTokenAsync(user);
            var callbackUrl = $"http://localhost:3000/verify-email?userId={user.Id}&token={token}";

            await _emailService.SendEmailAsync(user.Email, "Verify your email", $"Please verify your email by clicking <a href='{callbackUrl}'>here</a>.");
            return true;
        }

        public async Task<bool> SendPhoneNumberVerificationAsync(string userId)
        {
            var user = await _accountRepository.FindByIdAsync(userId);
            if (user == null) return false;

            var token = await _accountRepository.GeneratePhoneNumberConfirmationTokenAsync(user);
            await _smsService.SendSmsAsync(user.PhoneNumber, $"Your verification code is {token}");
            return true;
        }

        public async Task<bool> VerifyEmailAsync(VerifyAccountDto verifyAccountDto)
        {
            var user = await _accountRepository.FindByIdAsync(verifyAccountDto.UserId);
            if (user == null) return false;

            return await _accountRepository.ConfirmEmailAsync(user, verifyAccountDto.Token);
        }

        public async Task<bool> VerifyPhoneNumberAsync(VerifyAccountDto verifyAccountDto)
        {
            var user = await _accountRepository.FindByIdAsync(verifyAccountDto.UserId);
            if (user == null) return false;

            return await _accountRepository.ConfirmPhoneNumberAsync(user, verifyAccountDto.Token);
        }

        public async Task<bool> LockAccountAsync(LockAccountDto lockAccountDto)
        {
            var user = await _accountRepository.FindByIdAsync(lockAccountDto.UserId);
            if (user == null) return false;

            return await _accountRepository.LockAccountAsync(user, lockAccountDto.Lock);
        }
    }
}