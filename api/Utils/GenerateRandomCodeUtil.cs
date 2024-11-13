using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Utils
{
    public static class GenerateRandomCodeUtil
    {
        public static string GenerateRandomCode()
        {
            var random = new Random();
            // Generate a random 6-digit number
            return random.Next(100000, 999999).ToString();
        }

    }
}