using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Role
{
    public class AssignRoleToUserRequest
    {
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
    }
}