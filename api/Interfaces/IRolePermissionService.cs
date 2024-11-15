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
        Task<bool> AssignPermissionsToRoleAsync(Guid roleId, List<Guid> permissionIds);
        Task<IEnumerable<RolePermission>> GetPermissionsByRoleIdAsync(Guid roleId);
    }
}