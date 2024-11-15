using System.Threading.Tasks;
using api.Data;
using api.Dtos.User;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using api.Dtos.Account;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IRoleService _roleService;
        private readonly ILogger<UserService> _logger;

        public UserService(
            ApplicationDbContext context,
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            IRoleService roleService,
            ILogger<UserService> logger
            )
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _roleService = roleService;
            _logger = logger;
        }

        public async Task<bool> CheckUsernameExistsAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            return user != null;
        }

        public async Task<bool> CheckEmailExistsAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null;
        }


        public async Task<ServiceResponse> CreateUserAsync(AddUserDto createUserDto)
        {
            // Implement user creation logic here
            // Validate and save user to the database
            // Return appropriate response
            var user = new User
            {
                Email = createUserDto.Email,
                UserName = createUserDto.UserName,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                PhoneNumber = createUserDto.PhoneNumber,
                FullAddress = createUserDto.FullAddress,
                DateOfBirth = createUserDto.DateOfBirth,
                Gender = createUserDto.Gender,
                ProfilePicture = createUserDto.ProfilePicture,
                ProvinceCode = createUserDto.ProvinceCode,
                DistrictCode = createUserDto.DistrictCode,
                CommuneCode = createUserDto.CommuneCode
            };

            var result = await _userManager.CreateAsync(user, createUserDto.Password);
            if (!result.Succeeded)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User creation failed: " + string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            // Assign the default role of "User"
            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "Role assignment failed: " + string.Join(", ", roleResult.Errors.Select(e => e.Description))
                };
            }

            return new ServiceResponse
            {
                Success = true,
                Message = "User created successfully"
            };
        }

        public async Task<bool> DeleteUserAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null || user.IsDeleted)
            {
                return null;
            }
            return user;
        }

        public async Task<IEnumerable<string>> GetPermissionsForRoleAsync(string role)
        {
            var roleEntity = await _roleManager.FindByNameAsync(role);
            if (roleEntity != null)
            {
                var permissions = await _context.RolePermissions
                    .Where(rp => rp.RoleId == roleEntity.Id)
                    .Select(rp => rp.PermissionId)
                    .ToListAsync();

                var permissionNames = await _context.Permissions
                    .Where(p => permissions.Contains(p.PermissionId))
                    .Select(p => p.Name)
                    .ToListAsync();

                return permissionNames;
            }

            return Enumerable.Empty<string>();
        }


        public async Task<bool> SaveUserAsync(UserDto userDto)
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user != null)
                return true;

            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                return false;

            user = new User
            {
                Email = userDto.Email.ToString(),
                UserName = userDto.Email.ToString(),
                LastName = userDto.LastName.ToString(),
                FirstName = userDto.FirstName.ToString()
            };

            Console.WriteLine("Creating user: " + user.Email);

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return false;
            }

            // Assign the default role of "User"
            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
            {
                return false;
            }
            return true;
        }



        public async Task<List<User>> GetUserAsync()
        {
            return await _userManager.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
                            .ThenInclude(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<User> FindOrCreateUserAsync(string email, string firebaseUid)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email
                    // Add any other properties you need, but omit FirebaseUid
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    throw new Exception("User creation failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }

            return user;
        }


        public async Task<IList<Guid>> GetUserRolesAsync(User user)
        {
            // Get role names associated with the user
            var roleNames = await _userManager.GetRolesAsync(user);

            // Assuming you have a method to retrieve role GUIDs from role names
            var roleGuids = new List<Guid>();

            foreach (var roleName in roleNames)
            {
                // Lookup each role GUID based on role name
                var roleGuid = await _roleService.GetRoleIdByNameAsync(roleName);
                if (roleGuid.HasValue)
                {
                    roleGuids.Add(roleGuid.Value);
                }
            }

            return roleGuids;
        }


        public async Task<bool> AddUserAsync(AddUserDto userDto)
        {
            var user = new User
            {
                Email = userDto.Email,
                UserName = userDto.UserName,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                PhoneNumber = userDto.PhoneNumber,
                FullAddress = userDto.FullAddress,
                DateOfBirth = userDto.DateOfBirth,
                Gender = userDto.Gender,
                ProvinceCode = userDto.ProvinceCode,
                DistrictCode = userDto.DistrictCode,
                CommuneCode = userDto.CommuneCode
            };

            var result = await _userManager.CreateAsync(user, userDto.Password);
            if (!result.Succeeded)
                return false;

            // Assign the default role of "User"
            var roleResult = await _userManager.AddToRoleAsync(user, "Customer");
            if (!roleResult.Succeeded)
                return false;

            return true;
        }

        public async Task<bool> UpdatePersonalInfoAsync(User user, UpdatePersonalInfoDto updatePersonalInfoDto)
        {
            // Check if user exists
            if (user == null)
            {
                return false;
            }

            // Update the user properties with data from the PersonalInfoDto
            user.FirstName = updatePersonalInfoDto.FirstName ?? user.FirstName;
            user.LastName = updatePersonalInfoDto.LastName ?? user.LastName;
            user.PhoneNumber = updatePersonalInfoDto.PhoneNumber;
            user.ProvinceCode = updatePersonalInfoDto.ProvinceCode;
            user.DistrictCode = updatePersonalInfoDto.DistrictCode;
            user.CommuneCode = updatePersonalInfoDto.CommuneCode;
            user.FullAddress = updatePersonalInfoDto.FullAddress;
            user.DateOfBirth = updatePersonalInfoDto.DateOfBirth;
            user.Gender = updatePersonalInfoDto.Gender;

            // Save the changes to the database
            var result = await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();
            return result.Succeeded;
        }

        public async Task<bool> SoftDeleteUserAsync(User user)
        {
            // Check if the user exists
            if (user == null)
            {
                return false;
            }

            // Soft delete the user by setting the IsDeleted flag to true
            user.IsDeleted = true;

            await _userManager.UpdateAsync(user); // Mark the entity as modified
            await _context.SaveChangesAsync(); // Persist changes to the database

            return true;
        }

        public async Task<bool> UpdateUserAsync(User user, UpdateUserDto userDto)
        {
            if (user == null || userDto == null)
            {
                return false;
            }

            user.FirstName = userDto.FirstName ?? user.FirstName;
            user.LastName = userDto.LastName ?? user.LastName;
            user.UserName = userDto.UserName;
            user.Email = userDto.Email;
            user.PhoneNumber = userDto.PhoneNumber;
            user.Gender = userDto.Gender;
            user.DateOfBirth = userDto.DateOfBirth;
            user.ProvinceCode = userDto.ProvinceCode;
            user.DistrictCode = userDto.DistrictCode;
            user.CommuneCode = userDto.CommuneCode;
            user.FullAddress = userDto.FullAddress;
            // Save changes
            var result = await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();
            return result.Succeeded;
        }

        public async Task<IdentityResult> AssignRoleToUserAsync(Guid userId, Guid roleId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            var role = await _roleManager.FindByIdAsync(roleId.ToString());

            if (user == null || role == null)
                throw new ArgumentException("User or Role not found.");

            return await _userManager.AddToRoleAsync(user, role.Name);
        }

        public async Task<bool> IsUserExistingAsync(string email, string userName)
        {
            // Check if user exists by email
            var userByEmail = await _userManager.FindByEmailAsync(email);
            if (userByEmail != null)
            {
                return true; // User found by email
            }

            // Check if user exists by username
            var userByName = await _userManager.FindByNameAsync(userName);
            if (userByName != null)
            {
                return true; // User found by username
            }

            // No user found by email or username
            return false;
        }

        public async Task<bool> Restore(User user)
        {
            if (user == null) return false;

            // Set IsDeleted to false to "restore" the user
            user.IsDeleted = false;

            // Attach user to the context if it's not already being tracked
            _context.Users.Attach(user);

            // Mark IsDeleted property as modified
            _context.Entry(user).Property(u => u.IsDeleted).IsModified = true;

            var result = await _userManager.UpdateAsync(user);

            // If using SaveChanges directly, ensure it's needed for your configuration
            if (result.Succeeded)
            {
                await _context.SaveChangesAsync();
            }

            return result.Succeeded;
        }

        public async Task<List<User>> SearchUsersAsync(string searchTerm)
        {
            return await _context.Users
                        .Where(u => u.UserName.Contains(searchTerm) || u.Email.Contains(searchTerm))
                        .ToListAsync();
        }
    }
}