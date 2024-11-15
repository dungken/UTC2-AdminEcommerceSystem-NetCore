using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IVerificationCodeService
    {
        Task StoreVerificationCodeAsync(string userId, string code);
        Task<string> GetVerificationCodeAsync(string userId);

    }

}