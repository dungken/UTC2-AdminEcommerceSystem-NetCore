using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class AppRole : IdentityRole
    {
        public string? Description { get; set; }
        public ICollection<RolePermission>? RolePermissions { get; set; }
    }
}