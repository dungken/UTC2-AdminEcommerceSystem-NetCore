using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class LoginUserDto
    {
        [Required]
        public string EmailOrUsername { get; set; } // Accept either email or username

        [Required]
        public string Password { get; set; }
    }
}