using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Role
{
    public class PermissionWithRolesDto
    {
        public Guid PermissionId { get; set; }
        public string PermissionName { get; set; }
        public List<RoleDto> Roles { get; set; }
    }
}