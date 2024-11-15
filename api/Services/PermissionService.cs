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

        // Get all permissions
        public async Task<IEnumerable<Permission>> GetPermissionsAsync()
        {
            return await _context.Permissions.ToListAsync();
        }

        // Get permission by ID
        public async Task<Permission> GetPermissionByIdAsync(Guid permissionId)
        {
            return await _context.Permissions
                .FirstOrDefaultAsync(p => p.PermissionId == permissionId);
        }

        public async Task<Permission> CreateOrUpdatePermissionAsync(CreatePermissionDto permissionDto)
        {
            // Check if the permission with the specified ID exists
            var existingPermission = await _context.Permissions
                .FirstOrDefaultAsync(p => p.PermissionId == permissionDto.PermissionId);

            // If it exists, update the permission details
            if (existingPermission != null)
            {
                // Update all necessary fields
                existingPermission.Name = permissionDto.Name;  // Update Name as well
                existingPermission.Description = permissionDto.Description;
                existingPermission.IsCorePermission = permissionDto.IsCorePermission;

                // Mark the entity as modified and save changes
                _context.Permissions.Update(existingPermission);
            }
            else
            {
                // If it doesn't exist, create a new permission
                var newPermission = new Permission
                {
                    PermissionId = Guid.NewGuid(), // Assign a new GUID
                    Name = permissionDto.Name,
                    Description = permissionDto.Description,
                    IsCorePermission = permissionDto.IsCorePermission
                };

                // Add the new permission to the database
                await _context.Permissions.AddAsync(newPermission);

                // Save the new permission
                await _context.SaveChangesAsync();

                // Return the newly created permission
                return newPermission;
            }

            // Save changes if updating the existing permission
            await _context.SaveChangesAsync();

            // Return the updated existing permission
            return existingPermission;
        }


        // Delete a permission by ID
        public async Task<bool> DeletePermissionAsync(Guid permissionId)
        {
            var permission = await _context.Permissions
                .FirstOrDefaultAsync(p => p.PermissionId == permissionId);

            if (permission == null)
            {
                return false;
            }

            _context.Permissions.Remove(permission);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get permissions by user ID (based on roles)
        public async Task<IList<Permission>> GetPermissionsByUserIdAsync(Guid userId)
        {
            var roleIds = await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.RoleId)
                .ToListAsync();

            if (!roleIds.Any())
                return new List<Permission>();

            var permissions = await _context.RolePermissions
                .Where(rp => roleIds.Contains(rp.RoleId))
                .Select(rp => rp.Permission)
                .Distinct()
                .ToListAsync();

            return permissions;
        }

        // Get permissions with roles
        public async Task<IEnumerable<PermissionWithRolesDto>> GetPermissionsWithRolesAsync()
        {
            return await _context.Permissions
                .Include(p => p.RolePermissions)
                .ThenInclude(rp => rp.Role)
                .ThenInclude(r => r.UserRoles) // Include UserRoles
                .ThenInclude(ur => ur.User)    // Then include User to get user details
                .Select(p => new PermissionWithRolesDto
                {
                    PermissionId = p.PermissionId,
                    PermissionName = p.Name,
                    Roles = p.RolePermissions.Select(rp => new RoleDto
                    {
                        Id = rp.Role.Id,
                        Name = rp.Role.Name,
                        TotalUser = rp.Role.UserRoles.Count,
                        Avatars = rp.Role.UserRoles.Select(ur => ur.User.ProfilePicture).ToList(),
                        Permissions = rp.Role.RolePermissions.Select(rp => rp.PermissionId).ToList()
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<IList<Permission>> GetPermissionsAsync(Guid userId)
        {
            // Fetch the roles assigned to the user
            var roleIds = await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.RoleId)
                .ToListAsync();

            // If the user has no roles, return an empty list
            if (!roleIds.Any())
                return new List<Permission>();

            // Fetch permissions linked to the roles assigned to the user
            var permissions = await _context.RolePermissions
                .Where(rp => roleIds.Contains(rp.RoleId))
                .Select(rp => rp.Permission)
                .Distinct()  // Ensure that permissions are unique
                .ToListAsync();

            return permissions;
        }
    }
}