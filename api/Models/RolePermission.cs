using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
        public class RolePermission
        {
                public Guid RolePermissionId { get; set; }
                public Guid RoleId { get; set; }
                public Role Role { get; set; }
                public Guid PermissionId { get; set; }
                public Permission Permission { get; set; }
        }
}