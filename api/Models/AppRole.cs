using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class AppRole : IdentityRole
    {
        public string? Description { get; set; }
        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}