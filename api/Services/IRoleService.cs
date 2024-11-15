using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Role;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetAllRolesAsync();
        Task<RoleDto> GetRoleByIdAsync(Guid roleId);
        Task<Role> CreateOrUpdateRoleAsync(CreateRoleDto roleDto);
        Task<bool> DeleteRoleAsync(Guid roleId);
        Task<Guid?> GetRoleIdByNameAsync(string roleName);
    }
}