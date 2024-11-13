using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Dtos.Role;
using api.Models;

namespace api.Services
{
    public interface IPermissionService
    {
        Task<Permission> CreatePermissionAsync(Permission permission);
        Task<bool> UpdatePermissionAsync(Guid id, Permission permission);
        Task<Permission> GetPermissionAsync(Guid id);
        Task<IEnumerable<Permission>> GetPermissionsAsync(); // Lấy tất cả quyền
        Task DeletePermissionAsync(Guid id);
        Task<IList<Permission>> GetPermissionsAsync(Guid userId);
    }
}