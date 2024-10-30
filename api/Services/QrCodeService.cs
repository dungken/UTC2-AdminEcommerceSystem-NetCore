using System.Drawing;
using System.Net;
using System.Net.Mail;
using api.Interfaces;
using ZXing;
using ZXing.Windows.Compatibility;

namespace api.Services
{
    public class QrCodeService : IQrCodeService
    {
        private readonly IConfiguration _config;

        public QrCodeService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendTwoFactorSetupEmail(string email, string qrCodeUri)
        {
            using (var smtpClient = new SmtpClient(_config["Email:Smtp:Host"])
            {
                Port = int.Parse(_config["Email:Smtp:Port"]),
                Credentials = new NetworkCredential(_config["Email:Smtp:Username"], _config["Email:Smtp:Password"]),
                EnableSsl = bool.Parse(_config["Email:Smtp:EnableSsl"])
            })
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_config["Email:From"]),
                    Subject = "Set Up Two-Factor Authentication",
                    IsBodyHtml = true
                };
                mailMessage.To.Add(email);

                // Generate QR code image
                var qrCodeImage = GenerateQrCodeImage(qrCodeUri);

                // Create HTML view with embedded image
                var htmlBody = @"<html><body>Please set up two-factor authentication by scanning the QR code below:<br><img src='cid:QrCodeImage' alt='QR Code' /></body></html>";
                var htmlView = AlternateView.CreateAlternateViewFromString(htmlBody, null, "text/html");

                // Create LinkedResource for the inline image
                var qrCodeLinkedResource = new LinkedResource(new MemoryStream(qrCodeImage), "image/png")
                {
                    ContentId = "QrCodeImage",
                    TransferEncoding = System.Net.Mime.TransferEncoding.Base64
                };

                htmlView.LinkedResources.Add(qrCodeLinkedResource);
                mailMessage.AlternateViews.Add(htmlView);

                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        public byte[] GenerateQrCodeImage(string qrCodeUri)
        {
            try
            {
                // Create a BarcodeWriter instance for generating QR codes
                var barcodeWriter = new ZXing.Windows.Compatibility.BarcodeWriter
                {
                    Format = BarcodeFormat.QR_CODE,
                    Options = new ZXing.Common.EncodingOptions
                    {
                        Width = 300,  // Set the width of the QR code
                        Height = 300, // Set the height of the QR code
                        Margin = 1    // Set a margin around the QR code
                    }
                };

                // Generate the QR code as a Bitmap image
                using (Bitmap bitmap = barcodeWriter.Write(qrCodeUri))
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        // Save the Bitmap image to the memory stream in PNG format
                        bitmap.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Png);
                        return memoryStream.ToArray(); // Return the image as a byte array
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework)
                Console.WriteLine($"Error generating QR Code: {ex.Message}");
                return null; // Handle as appropriate
            }
        }

        public string GenerateQrCodeUri(string email, string secret)
        {
            var encodedEmail = WebUtility.UrlEncode(email);
            var encodedSecret = WebUtility.UrlEncode(secret);
            var issuer = WebUtility.UrlEncode("MyEcommerceApp");

            return $"otpauth://totp/{encodedEmail}?secret={encodedSecret}&issuer={issuer}";
        }

        public string DecodeQrCodeImage(byte[] qrCodeImage)
        {
            using (var ms = new MemoryStream(qrCodeImage))
            {
                using (var bitmap = new Bitmap(ms))
                {
                    var barcodeReader = new BarcodeReader();
                    var result = barcodeReader.Decode(bitmap);
                    return result?.Text;
                }
            }
        }

        public string GenerateBase32Secret(int length = 16)
        {
            const string base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var random = new Random();
            var secret = new char[length];

            for (int i = 0; i < length; i++)
            {
                secret[i] = base32Chars[random.Next(base32Chars.Length)];
            }

            return new string(secret);
        }

    }
}
