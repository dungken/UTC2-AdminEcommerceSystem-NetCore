using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IQRCodeService
    {
        string GenerateQrCodeUri(string email, string key);
        byte[] GenerateQrCodeImage(string qrCodeUri);
    }
}