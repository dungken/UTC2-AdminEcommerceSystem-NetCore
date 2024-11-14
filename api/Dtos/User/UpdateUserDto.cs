
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.User
{
    public class UpdateUserDto
    {
        [Required]
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [Required]
        [MinLength(6)]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProvinceCode { get; set; }
        public string? DistrictCode { get; set; }
        public string? CommuneCode { get; set; }
        public string? FullAddress { get; set; }
    }
}