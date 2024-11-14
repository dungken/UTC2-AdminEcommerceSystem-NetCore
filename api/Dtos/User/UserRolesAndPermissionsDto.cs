using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.User
{
    public class UserRolesAndPermissionsDto
    {
        public string UserId { get; set; }
        public List<string> Roles { get; set; }
        public List<string> Permissions { get; set; }
    }
}