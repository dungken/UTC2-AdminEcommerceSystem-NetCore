using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Base32;
using OtpSharp;

namespace api.Models
{

    public class TwoFactorAuthenticator
    {
        // This method verifies the TOTP token allowing a grace period.
        public bool VerifyTotpWithGracePeriod(string secretKey, string userInputToken)
        {
            // Decode the secret key from Base32
            var totp = new Totp(Base32Encoder.Decode(secretKey));

            // Allow a grace period of 30 seconds (verificationWindow allows the previous/next time step)
            // If verificationWindow is not supported, you can implement your own logic.
            return totp.VerifyTotp(userInputToken, out long timeStepMatched);
        }

        // If the library version does not support verification window, implement a custom logic
        public bool VerifyTotpWithCustomGracePeriod(string secretKey, string userInputToken, int gracePeriodInSeconds = 30)
        {
            var totp = new Totp(Base32Encoder.Decode(secretKey));

            // Get the current time step
            var currentTimeStep = totp.ComputeTotp(DateTime.UtcNow);

            // Check against the current time step
            if (totp.VerifyTotp(userInputToken, out long timeStepMatched))
            {
                return true; // Valid token
            }

            // Check if the token was generated within the grace period
            // Calculate the time step for the grace period before and after
            var timeStepBefore = totp.ComputeTotp(DateTime.UtcNow.AddSeconds(-gracePeriodInSeconds));
            var timeStepAfter = totp.ComputeTotp(DateTime.UtcNow.AddSeconds(gracePeriodInSeconds));

            return userInputToken == timeStepBefore || userInputToken == timeStepAfter;
        }
    }

}