using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly ApplicationDBContext _context;

        public RoleRepository(RoleManager<AppRole> roleManager, ApplicationDBContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<IEnumerable<AppRole>> GetRolesAsync()
        {
            return await _roleManager.Roles.ToListAsync();
        }

        public async Task<AppRole> GetRoleByIdAsync(string roleId)
        {
            return await _roleManager.FindByIdAsync(roleId);
        }

        public async Task<bool> CreateRoleAsync(AppRole role)
        {
            var result = await _roleManager.CreateAsync(role);
            return result.Succeeded;
        }

        public async Task<bool> UpdateRoleAsync(AppRole role)
        {
            var result = await _roleManager.UpdateAsync(role);
            return result.Succeeded;
        }

        public async Task<bool> DeleteRoleAsync(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null) return false;
            var result = await _roleManager.DeleteAsync(role);
            return result.Succeeded;
        }

        public async Task<IEnumerable<Permission>> GetPermissionsAsync()
        {
            return await _context.Permissions.ToListAsync();
        }

        public async Task<Permission> GetPermissionByIdAsync(string permissionId)
        {
            return await _context.Permissions.FindAsync(permissionId);
        }

        public async Task<bool> CreatePermissionAsync(Permission permission)
        {
            _context.Permissions.Add(permission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatePermissionAsync(Permission permission)
        {
            _context.Permissions.Update(permission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeletePermissionAsync(string permissionId)
        {
            var permission = await _context.Permissions.FindAsync(permissionId);
            if (permission == null) return false;
            _context.Permissions.Remove(permission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AssignPermissionToRoleAsync(string roleId, string permissionId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            var permission = await _context.Permissions.FindAsync(permissionId);
            if (role == null || permission == null) return false;

            var rolePermission = new RolePermission
            {
                RoleId = roleId,
                PermissionId = permissionId
            };

            _context.RolePermissions.Add(rolePermission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemovePermissionFromRoleAsync(string roleId, string permissionId)
        {
            var rolePermission = await _context.RolePermissions
                .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
            if (rolePermission == null) return false;

            _context.RolePermissions.Remove(rolePermission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<AppRole>> GetRolesByNamesAsync(IList<string> roles)
        {
            return await _roleManager.Roles
            .Where(r => roles.Contains(r.Name))
            .ToListAsync();
        }
    }
}