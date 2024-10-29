using api.Dtos.Role;
using api.Models;

namespace api.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetRolesAsync(AppUser user);
        Task<RoleDto> GetRoleByIdAsync(string roleId);
        Task<bool> CreateRoleAsync(RoleDto roleDto);
        Task<bool> UpdateRoleAsync(RoleDto roleDto);
        Task<bool> DeleteRoleAsync(string roleId);
        Task<IEnumerable<PermissionDto>> GetPermissionsAsync();
        Task<PermissionDto> GetPermissionByIdAsync(string id);
        Task<bool> AssignPermissionToRoleAsync(string roleId, string permissionId);
        Task<bool> RemovePermissionFromRoleAsync(string roleId, string permissionId);
        Task<bool> CreatePermissionAsync(PermissionDto permissionDto);
        Task<bool> UpdatePermissionAsync(PermissionDto permissionDto);
        Task<bool> DeletePermissionAsync(string id);
        Task<bool> AssignRoleToUserAsync(string userId, string roleId);
        Task<IEnumerable<RoleDto>> GetRolesAsync();
    }
}