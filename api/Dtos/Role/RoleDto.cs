using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Role
{
    public class RoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int TotalUser { get; set; }
        public List<string> Avatars { get; set; }
        public List<Guid> Permissions { get; set; }
    }

}