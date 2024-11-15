using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Role
{
    public class CreatePermissionDto
    {
        public Guid PermissionId { get; set; } // Optional, can be used when updating an existing permission
        public string Name { get; set; } // Name of the permission
        public string Description { get; set; } // Description of the permission
        public bool IsCorePermission { get; set; } // Whether the permission is a core system permission
    }
}