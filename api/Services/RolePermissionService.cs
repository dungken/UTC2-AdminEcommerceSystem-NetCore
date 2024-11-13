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
    public class RolePermissionService : IRolePermissionService
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> AssignPermissionToRoleAsync(RolePermissionDto dto)
        {
            var role = await _context.Roles.FindAsync(dto.RoleId);
            var permission = await _context.Permissions.FindAsync(dto.PermissionId);

            if (role == null || permission == null)
                return "Role or Permission not found.";

            var rolePermission = new RolePermission
            {
                RoleId = dto.RoleId,
                PermissionId = dto.PermissionId
            };

            Console.WriteLine(rolePermission.RoleId);
            Console.WriteLine(rolePermission.PermissionId);

            _context.RolePermissions.Add(rolePermission);
            await _context.SaveChangesAsync();
            return "Permission assigned to role successfully.";
        }

        public async Task<IEnumerable<RolePermission>> GetPermissionsByRoleIdAsync(Guid roleId)
        {
            return await _context.RolePermissions
                              .Where(rp => rp.RoleId == roleId)
                              .Include(rp => rp.Permission) // Assuming a navigation property to Permission
                              .ToListAsync();
        }
    }
}