using api.Dtos.Role;
using api.Interfaces;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public RoleService(IRoleRepository roleRepository, IMapper mapper, UserManager<AppUser> userManager)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
            _userManager = userManager;
        }


        public async Task<IEnumerable<RoleDto>> GetRolesAsync()
        {
            var roles = await _roleRepository.GetRolesAsync();
            return _mapper.Map<IEnumerable<RoleDto>>(roles);
        }

        public async Task<RoleDto> GetRoleByIdAsync(string roleId)
        {
            var role = await _roleRepository.GetRoleByIdAsync(roleId);
            return _mapper.Map<RoleDto>(role);
        }

        public async Task<bool> CreateRoleAsync(RoleDto roleDto)
        {
            var role = _mapper.Map<AppRole>(roleDto);
            return await _roleRepository.CreateRoleAsync(role);
        }

        public async Task<bool> UpdateRoleAsync(RoleDto roleDto)
        {
            var role = _mapper.Map<AppRole>(roleDto);
            return await _roleRepository.UpdateRoleAsync(role);
        }

        public async Task<bool> DeleteRoleAsync(string roleId)
        {
            return await _roleRepository.DeleteRoleAsync(roleId);
        }

        public async Task<IEnumerable<PermissionDto>> GetPermissionsAsync()
        {
            var permissions = await _roleRepository.GetPermissionsAsync();
            return _mapper.Map<IEnumerable<PermissionDto>>(permissions);
        }

        public async Task<bool> AssignPermissionToRoleAsync(string roleId, string permissionId)
        {
            return await _roleRepository.AssignPermissionToRoleAsync(roleId, permissionId);
        }

        public async Task<bool> RemovePermissionFromRoleAsync(string roleId, string permissionId)
        {
            return await _roleRepository.RemovePermissionFromRoleAsync(roleId, permissionId);
        }

        public async Task<PermissionDto> GetPermissionByIdAsync(string id)
        {
            var permission = await _roleRepository.GetPermissionByIdAsync(id);
            return _mapper.Map<PermissionDto>(permission);
        }

        public async Task<bool> CreatePermissionAsync(PermissionDto permissionDto)
        {
            var permission = _mapper.Map<Permission>(permissionDto);
            return await _roleRepository.CreatePermissionAsync(permission);
        }

        public async Task<bool> UpdatePermissionAsync(PermissionDto permissionDto)
        {
            var permission = _mapper.Map<Permission>(permissionDto);
            return await _roleRepository.UpdatePermissionAsync(permission);
        }

        public async Task<bool> DeletePermissionAsync(string id)
        {
            return await _roleRepository.DeletePermissionAsync(id);
        }

        public async Task<bool> AssignRoleToUserAsync(string userId, string roleId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.AddToRoleAsync(user, roleId);
            return result.Succeeded;
        }

        public async Task<IEnumerable<RoleDto>> GetRolesAsync(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var roleEntities = await _roleRepository.GetRolesByNamesAsync(roles);
            return _mapper.Map<IEnumerable<RoleDto>>(roleEntities);
        }

        async Task<IEnumerable<RoleDto>> IRoleService.GetRolesAsync()
        {
            var roles = await _roleRepository.GetRolesAsync();
            return _mapper.Map<IEnumerable<RoleDto>>(roles);
        }
    }
}