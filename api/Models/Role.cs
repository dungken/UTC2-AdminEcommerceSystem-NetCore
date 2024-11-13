using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class Role : IdentityRole<Guid>
    {
        // Navigation property for role permissions
        [JsonIgnore]
        public ICollection<RolePermission> RolePermissions { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}