using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Utils
{
    public static class FormatPhoneNumberUtil
    {
        public static string FormatPhoneNumber(string phoneNumber)
        {
            // Remove leading zero and add country code for Vietnam
            if (phoneNumber.StartsWith("0"))
            {
                phoneNumber = phoneNumber.Substring(1); // Remove leading zero
            }
            return $"+84{phoneNumber}"; // Add country code
        }

    }
}