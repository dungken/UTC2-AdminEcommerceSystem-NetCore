using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class Verify2FADto
    {
        public string? UserId { get; set; }
        [Required]
        public string VerifyCode { get; set; }
    }
}