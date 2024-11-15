using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Dtos.Role;
using api.Models;

namespace api.Services
{
    public interface IPermissionService
    {
        Task<Permission> GetPermissionByIdAsync(Guid permissionId);
        Task<IEnumerable<Permission>> GetPermissionsAsync();
        Task<IEnumerable<PermissionWithRolesDto>> GetPermissionsWithRolesAsync();
        Task<Permission> CreateOrUpdatePermissionAsync(CreatePermissionDto permissionDto);
        Task<bool> DeletePermissionAsync(Guid permissionId);
        Task<IList<Permission>> GetPermissionsByUserIdAsync(Guid userId);
        Task<IList<Permission>> GetPermissionsAsync(Guid userId);
    }
}