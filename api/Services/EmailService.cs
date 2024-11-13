using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using api.Utils;
using ZXing.OneD;

namespace api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly IVerificationCodeService _verificationCode;

        public EmailService(IConfiguration configuration, IVerificationCodeService verificationCode)
        {
            _configuration = configuration;
            _verificationCode = verificationCode;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpClient = new SmtpClient(_configuration["Email:SmtpHost"])
            {
                Port = int.Parse(_configuration["Email:SmtpPort"]),
                Credentials = new NetworkCredential(_configuration["Email:Username"], _configuration["Email:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:From"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message, byte[] attachment = null)
        {
            var smtpClient = new SmtpClient(_configuration["Email:SmtpHost"])
            {
                Port = int.Parse(_configuration["Email:SmtpPort"]),
                Credentials = new NetworkCredential(_configuration["Email:Username"], _configuration["Email:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:From"]),
                Subject = subject,
                Body = message,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(toEmail);

            if (attachment != null)
            {
                var attachmentStream = new MemoryStream(attachment);
                var mailAttachment = new Attachment(attachmentStream, "qrcode.png", "image/png");
                mailMessage.Attachments.Add(mailAttachment);
            }

            await smtpClient.SendMailAsync(mailMessage);
        }


        public async Task SendVerificationCodeEmailAsync(string toEmail, string code)
        {
            string subject = "Your Verification Code";
            string body = $"<p>Your verification code is: <strong>{code}</strong></p>" +
                          "<p>Please enter this code to complete your verification process.</p>";
            Console.WriteLine("Content email is: " + body);

            await SendEmailAsync(toEmail, subject, body);
        }

    }
}
