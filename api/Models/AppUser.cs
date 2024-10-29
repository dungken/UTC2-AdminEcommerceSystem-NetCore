using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? TwoFactorSecret { get; set; }
    }
}