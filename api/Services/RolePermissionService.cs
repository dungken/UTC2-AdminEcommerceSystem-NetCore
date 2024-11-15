using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Role;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<Role> _roleManager;

        public RolePermissionService(
            ApplicationDbContext context,
            RoleManager<Role> roleManager
            )
        {
            _context = context;
            _roleManager = roleManager;
        }

        public async Task<bool> AssignPermissionsToRoleAsync(Guid roleId, List<Guid> permissionIds)
        {
            // Retrieve the role from the Role table
            var role = await _context.Roles.FindAsync(roleId);
            if (role == null)
            {
                return false; // Role not found
            }

            // Retrieve the existing permissions assigned to the role
            var existingPermissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            // Add new permissions to the role if they are not already assigned
            foreach (var permissionId in permissionIds)
            {
                // Check if the permission is already assigned to the role
                if (!existingPermissions.Any(rp => rp.PermissionId == permissionId))
                {
                    // Create a new RolePermission entry to associate the role with the permission
                    var rolePermission = new RolePermission
                    {
                        RoleId = roleId,
                        PermissionId = permissionId
                    };

                    // Add the new RolePermission to the context
                    _context.RolePermissions.Add(rolePermission);
                }
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return true; // Permissions assigned successfully
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