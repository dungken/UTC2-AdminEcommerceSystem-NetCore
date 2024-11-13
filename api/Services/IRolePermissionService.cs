using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Role;
using api.Models;

namespace api.Services
{
    public interface IRolePermissionService
    {
        Task<string> AssignPermissionToRoleAsync(RolePermissionDto dto);
        Task<IEnumerable<RolePermission>> GetPermissionsByRoleIdAsync(Guid roleId);
    }
}