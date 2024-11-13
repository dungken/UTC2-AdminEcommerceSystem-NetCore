using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Linq;
using System.Threading.Tasks;
using ZXing.Windows.Compatibility;

namespace api.Services
{
    public class QRCodeService : IQRCodeService
    {
        public byte[] GenerateQrCodeImage(string qrCodeUri)
        {
            var writer = new BarcodeWriter
            {
                Format = ZXing.BarcodeFormat.QR_CODE,
                Options = new ZXing.Common.EncodingOptions
                {
                    Width = 300,
                    Height = 300,
                    Margin = 1
                }
            };

            using (var bitmap = writer.Write(qrCodeUri))
            {
                using (var stream = new MemoryStream())
                {
                    bitmap.Save(stream, ImageFormat.Png);
                    return stream.ToArray();
                }
            }
        }

        public string GenerateQrCodeUri(string email, string key)
        {
            return $"otpauth://totp/{email}?secret={key}&issuer=EcommerceSystem&digits=6";
        }
    }
}