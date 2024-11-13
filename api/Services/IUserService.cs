using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Models;
using api.Dtos.Account;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface IUserService
    {
        Task<bool> SaveUserAsync(UserDto userDto);
        Task<ServiceResponse> CreateUserAsync(AddUserDto createUserDto);
        Task<bool> AddUserAsync(AddUserDto createUserDto);
        Task<User> GetUserByIdAsync(string id);
        Task<bool> DeleteUserAsync(string email);
        Task<bool> CheckUsernameExistsAsync(string username);
        Task<bool> CheckEmailExistsAsync(string email);
        Task<List<User>> GetUserAsync();
        Task<User> FindOrCreateUserAsync(string email, string firebaseUid);
        Task<IList<Guid>> GetUserRolesAsync(User user);
        Task<bool> UpdatePersonalInfoAsync(User user, UpdatePersonalInfoDto updatePersonalInfoDto);
        Task<bool> SoftDeleteUserAsync(User user);
        Task<bool> UpdateUserAsync(UpdateUserDto userDto);
        Task<IdentityResult> AssignRoleToUserAsync(Guid userId, Guid roleId);
    }
}