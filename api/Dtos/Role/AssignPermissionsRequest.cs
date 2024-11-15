using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Role
{
    public class AssignPermissionsRequest
    {
        public Guid RoleId { get; set; }
        public List<Guid> PermissionIds { get; set; }
    }
}