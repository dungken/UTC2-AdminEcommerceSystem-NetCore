using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Permission
    {
        public Guid PermissionId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsCorePermission { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}