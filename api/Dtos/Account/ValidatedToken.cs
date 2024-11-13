using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class ValidatedToken
    {
        public string Uid { get; set; } // User ID from Google or Facebook
        public string Email { get; set; } // User's email
        public string FirstName { get; set; } // User's first name (optional, depending on the provider)
        public string LastName { get; set; } // User's last name (optional, depending on the provider)
    }
}