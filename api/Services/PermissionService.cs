using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Role;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly ApplicationDbContext _context;

        public PermissionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Permission>> GetPermissionsAsync()
        {
            return await _context.Permissions.ToListAsync();
        }

        public async Task<Permission> CreatePermissionAsync(Permission permission)
        {
            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();
            return permission;
        }

        public async Task<bool> UpdatePermissionAsync(Guid id, Permission permission)
        {
            var existingPermission = await _context.Permissions.FindAsync(id);
            if (existingPermission == null) return false;

            existingPermission.Name = permission.Name;
            existingPermission.Description = permission.Description;
            existingPermission.IsCorePermission = permission.IsCorePermission;

            await _context.SaveChangesAsync();
            return true;
        }

        // Get Permission by ID
        public async Task<Permission> GetPermissionAsync(Guid id)
        {
            // Tìm kiếm Permission theo ID
            var permission = await _context.Permissions
                .FirstOrDefaultAsync(p => p.PermissionId == id);

            return permission; // Nếu không tìm thấy, sẽ trả về null
        }

        // Xóa Permission theo ID
        public async Task DeletePermissionAsync(Guid id)
        {
            // Tìm kiếm Permission theo ID
            var permission = await _context.Permissions
                .FirstOrDefaultAsync(p => p.PermissionId == id);

            if (permission == null)
            {
                throw new Exception("Permission not found"); // Nếu không tìm thấy permission, ném ngoại lệ
            }

            // Xóa Permission khỏi DbContext
            _context.Permissions.Remove(permission);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
        }

        public async Task<IList<Permission>> GetPermissionsAsync(Guid userId)
        {
            // Fetch user roles
            var roleIds = await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.RoleId)
                .ToListAsync();

            if (!roleIds.Any())
                return new List<Permission>();

            // Fetch permissions linked to the roles
            var permissions = await _context.RolePermissions
                .Where(rp => roleIds.Contains(rp.RoleId))
                .Select(rp => rp.Permission)
                .Distinct()
                .ToListAsync();

            return permissions;
        }
    }
}