using System.Threading.Tasks;
using api.Data;
using api.Dtos.Role;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly IRolePermissionService _rolePermissionService;
        private readonly IPermissionService _permissionService;
        private readonly UserManager<User> _userManager; // Assuming User is your user class
        private readonly ApplicationDbContext _context;

        public RoleService(
            RoleManager<Role> roleManager,
            IPermissionService permissionService,
            IRolePermissionService rolePermissionService,
            UserManager<User> userManager,
            ApplicationDbContext context) // Assuming User is your user class
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _permissionService = permissionService;
            _rolePermissionService = rolePermissionService;
            _userManager = userManager;
            _context = context;
        }

        public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            var roleDtos = new List<RoleDto>();

            foreach (var role in roles)
            {
                // Get users in the role
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
                var avatars = usersInRole.Select(u => u.ProfilePicture).ToList();

                // Get the permissions for the role (assumed you have a RolePermission table or service)
                var permissions = await GetPermissionsForRoleAsync(role.Id);

                // Create RoleDto
                roleDtos.Add(new RoleDto
                {
                    Id = role.Id,
                    Name = role.Name,
                    TotalUser = usersInRole.Count,
                    Avatars = avatars,
                    Permissions = permissions.ToList() // Add permissions here
                });
            }

            return roleDtos;
        }

        // A helper method to fetch the permissions for a given role
        private async Task<IEnumerable<Guid>> GetPermissionsForRoleAsync(Guid roleId)
        {
            // Assuming that you have a RolePermission service to fetch the permissions by roleId
            // Modify this method to suit your actual implementation for fetching permissions

            var rolePermissions = await _rolePermissionService.GetPermissionsByRoleIdAsync(roleId);

            // You can return permission names or other related info, depending on your implementation
            return rolePermissions.Select(rp => rp.Permission.PermissionId).ToList();
        }


        // Get role by ID
        public async Task<Role> GetRoleByIdAsync(string roleId)
        {
            return await _roleManager.FindByIdAsync(roleId);
        }

        // Create or update role based on role name
        public async Task<Role> CreateOrUpdateRoleAsync(CreateRoleDto roleDto)
        {
            var existingRole = await _roleManager.FindByNameAsync(roleDto.Name);
            if (existingRole != null)
            {
                return await UpdateRoleAsync(existingRole, roleDto);
            }
            else
            {
                return await CreateRoleAsync(roleDto);
            }
        }

        // Create a new role
        private async Task<Role> CreateRoleAsync(CreateRoleDto roleDto)
        {
            var role = new Role { Name = roleDto.Name };
            var createResult = await _roleManager.CreateAsync(role);

            if (!createResult.Succeeded)
            {
                return null; // Handle failure
            }

            // Directly use the permission GUIDs from the frontend
            List<Guid> permissionIds = roleDto.Permissions; // No need to fetch permissions by name

            if (!permissionIds.Any())
            {
                return null; // Handle failure, no valid permissions found
            }

            bool assignResult = await AssignPermissionsToRoleAsync(role.Id, permissionIds);

            return assignResult ? role : null;
        }

        // Update an existing role
        private async Task<Role> UpdateRoleAsync(Role existingRole, CreateRoleDto roleDto)
        {
            // Update the role name
            existingRole.Name = roleDto.Name;
            var updateResult = await _roleManager.UpdateAsync(existingRole);

            if (!updateResult.Succeeded)
            {
                return null; // Handle failure
            }

            // Directly use the permission GUIDs from the frontend
            List<Guid> permissionIds = roleDto.Permissions;

            if (!permissionIds.Any())
            {
                return null; // Handle failure, no valid permissions found
            }

            bool assignResult = await AssignPermissionsToRoleAsync(existingRole.Id, permissionIds);
            return assignResult ? existingRole : null;
        }

        // Assign permissions to a role
        private async Task<bool> AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<Guid> permissionIds)
        {
            foreach (var permissionId in permissionIds)
            {
                var dto = new RolePermissionDto
                {
                    RoleId = roleId,
                    PermissionId = permissionId
                };

                var result = await _rolePermissionService.AssignPermissionToRoleAsync(dto);
                if (result != "Permission assigned to role successfully.")
                {
                    return false; // Handle failure
                }
            }

            return true;
        }

        // Delete a role by ID (Guid type expected)
        public async Task<bool> DeleteRoleAsync(Guid roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                return false;

            var result = await _roleManager.DeleteAsync(role);
            return result.Succeeded;
        }

        public async Task<Guid?> GetRoleIdByNameAsync(string roleName)
        {
            var role = await _context.Roles
                .Where(r => r.Name.ToLower() == roleName.ToLower())  // Dùng ToLower() để so sánh không phân biệt hoa thường
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            return role == Guid.Empty ? (Guid?)null : role;
        }

    }
}
