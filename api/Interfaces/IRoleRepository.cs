using api.Models;

namespace api.Interfaces
{
    public interface IRoleRepository
    {
        Task<IEnumerable<AppRole>> GetRolesAsync();
        Task<AppRole> GetRoleByIdAsync(string roleId);
        Task<bool> CreateRoleAsync(AppRole role);
        Task<bool> UpdateRoleAsync(AppRole role);
        Task<bool> DeleteRoleAsync(string roleId);
        Task<IEnumerable<Permission>> GetPermissionsAsync();
        Task<Permission> GetPermissionByIdAsync(string permissionId);
        Task<bool> CreatePermissionAsync(Permission permission);
        Task<bool> UpdatePermissionAsync(Permission permission);
        Task<bool> DeletePermissionAsync(string permissionId);
        Task<bool> AssignPermissionToRoleAsync(string roleId, string permissionId);
        Task<bool> RemovePermissionFromRoleAsync(string roleId, string permissionId);
        Task<IEnumerable<AppRole>> GetRolesByNamesAsync(IList<string> roles);
    }
}