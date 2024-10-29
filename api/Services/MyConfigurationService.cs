using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public class MyConfigurationService
    {
        private readonly IConfiguration _config;

        public MyConfigurationService(IConfiguration config)
        {
            _config = config;
        }

        public void PrintSettings()
        {
            var smtpHost = _config["Email:Smtp:Host"];
            var smtpPort = _config["Email:Smtp:Port"];
            var smtpUsername = _config["Email:Smtp:Username"];
            var smtpPassword = _config["Email:Smtp:Password"];
            var smtpEnableSsl = _config["Email:Smtp:EnableSsl"];
            var twilioAccountSid = _config["Twilio:AccountSid"];
            var twilioAuthToken = _config["Twilio:AuthToken"];
            var twilioFromPhoneNumber = _config["Twilio:FromPhoneNumber"];

            Console.WriteLine($"SMTP Host: {smtpHost}");
            Console.WriteLine($"SMTP Port: {smtpPort}");
            Console.WriteLine($"SMTP Username: {smtpUsername}");
            Console.WriteLine($"SMTP Password: {smtpPassword}");
            Console.WriteLine($"SMTP Enable SSL: {smtpEnableSsl}");
            Console.WriteLine($"Twilio Account SID: {twilioAccountSid}");
            Console.WriteLine($"Twilio Auth Token: {twilioAuthToken}");
            Console.WriteLine($"Twilio From Phone Number: {twilioFromPhoneNumber}");
        }
    }
}