using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Services
{
    public class VerificationCodeService : IVerificationCodeService
    {
        private readonly Dictionary<string, (string Code, DateTime Expiration)> _verificationCodes = new();

        public Task StoreVerificationCodeAsync(string userId, string code)
        {
            var expiration = DateTime.UtcNow.AddMinutes(5); // Code valid for 5 minutes
            _verificationCodes[userId] = (code, expiration);
            return Task.CompletedTask; // Simulating an asynchronous method
        }

        public Task<string> GetVerificationCodeAsync(string userId)
        {
            if (_verificationCodes.TryGetValue(userId, out var codeEntry))
            {
                if (codeEntry.Expiration > DateTime.UtcNow)
                {
                    return Task.FromResult(codeEntry.Code); // Code is still valid
                }
                else
                {
                    _verificationCodes.Remove(userId); // Code expired
                }
            }
            return Task.FromResult<string>(null); // No valid code found
        }
    }
}
