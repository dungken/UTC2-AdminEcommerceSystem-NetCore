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
        public async Task<RoleDto> GetRoleByIdAsync(Guid roleId)
        {
            // Fetch the role by ID
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                return null;

            // Get users in the role
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
            var avatars = usersInRole.Select(u => u.ProfilePicture).ToList();

            // Get permissions for the role (assuming a service or helper method for fetching permissions)
            var permissions = await GetPermissionsForRoleAsync(roleId);

            // Construct and return RoleDto
            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                TotalUser = usersInRole.Count,
                Avatars = avatars,
                Permissions = permissions.ToList()
            };
        }

        public async Task<Role> CreateOrUpdateRoleAsync(CreateRoleDto roleDto)
        {
            // Check if the role already exists by name
            var existingRole = await _roleManager.FindByNameAsync(roleDto.Name);
            // Console.WriteLine("Role name is: " + existingRole.Name);

            if (existingRole != null)
            {
                // If the role exists, update it
                return await UpdateRoleAsync(existingRole, roleDto);
            }
            else
            {
                // If the role does not exist, create a new one
                return await CreateRoleAsync(roleDto);
            }
        }


        private async Task<Role> CreateRoleAsync(CreateRoleDto roleDto)
        {
            // Create the role object
            var role = new Role { Name = roleDto.Name };

            // Create the role using RoleManager
            var createResult = await _roleManager.CreateAsync(role);

            if (!createResult.Succeeded)
            {
                return null; // Handle failure (you can log or handle the error)
            }

            // Assign permissions to the newly created role
            bool assignResult = await AssignPermissionsToRoleAsync(role.Id, roleDto.Permissions);

            // If permissions are assigned successfully, return the role
            return assignResult ? role : null;
        }


        private async Task<Role> UpdateRoleAsync(Role existingRole, CreateRoleDto roleDto)
        {
            // Update the existing role's name
            existingRole.Name = roleDto.Name;

            // Update the role using RoleManager
            var updateResult = await _roleManager.UpdateAsync(existingRole);

            if (!updateResult.Succeeded)
            {
                return null; // Handle failure
            }

            // Assign new permissions to the existing role
            bool assignResult = await AssignPermissionsToRoleAsync(existingRole.Id, roleDto.Permissions);

            return assignResult ? existingRole : null;
        }


        private async Task<bool> AssignPermissionsToRoleAsync(Guid roleId, List<Guid> permissionIds)
        {
            // Remove the old permissions first
            var existingPermissions = _context.RolePermissions.Where(rp => rp.RoleId == roleId).ToList();
            _context.RolePermissions.RemoveRange(existingPermissions); // Removes existing permissions

            // Add the new permissions
            foreach (var permissionId in permissionIds)
            {
                var rolePermission = new RolePermission
                {
                    RoleId = roleId,
                    PermissionId = permissionId
                };

                await _context.RolePermissions.AddAsync(rolePermission);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return true; // Permissions assigned successfully
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
