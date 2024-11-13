using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Role
{
    public class RolePermissionDto
    {

        // If RoleId is of type Guid in your database
        public Guid RoleId { get; set; }

        // Permission ID should match the type of PermissionId in your database model (Guid)
        public Guid PermissionId { get; set; }
    }
}