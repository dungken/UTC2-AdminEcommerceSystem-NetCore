using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api.Data;

namespace api.Services
{
    public class UserPermissionService : IUserPermissionService
    {
        private readonly ApplicationDbContext _context;

        public UserPermissionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasPermissionAsync(string userId, string permission)
        {
            // Kiểm tra quyền của người dùng từ cơ sở dữ liệu
            var permissionId = await _context.Permissions
                                              .Where(p => p.Name == permission)
                                              .Select(p => p.PermissionId)
                                              .FirstOrDefaultAsync();

            if (permissionId == Guid.Empty) return false;

            // Kiểm tra bảng RolePermission để xác định quyền của người dùng
            var userHasPermission = await _context.RolePermissions
                                        .AnyAsync(rp => rp.RolePermissionId == Guid.Parse(userId)
                                                                    && rp.PermissionId == permissionId);

            return userHasPermission;
        }
    }
}