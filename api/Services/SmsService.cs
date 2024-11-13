using System.Threading.Tasks;
using api.Utils;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace api.Services
{
    public class SmsService : ISmsService
    {
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _fromNumber;

        public SmsService(IConfiguration configuration)
        {
            _accountSid = configuration["Twilio:AccountSid"];
            _authToken = configuration["Twilio:AuthToken"];
            _fromNumber = configuration["Twilio:FromPhoneNumber"];
        }

        public Task SendSmsAsync(string number, string message)
        {
            TwilioClient.Init(_accountSid, _authToken);

            var messageResource = MessageResource.CreateAsync(
                to: new PhoneNumber(FormatPhoneNumberUtil.FormatPhoneNumber(number)),
                from: new PhoneNumber(_fromNumber),
                body: message
            );

            return messageResource;
        }
    }
}