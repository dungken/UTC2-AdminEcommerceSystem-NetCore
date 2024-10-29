using api.Dtos.Role;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetRolesAsync();
            return Ok(roles);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var role = await _roleService.GetRoleByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto roleDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _roleService.CreateRoleAsync(roleDto);
            if (!result) return BadRequest("Failed to create role");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleDto roleDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            roleDto.Id = id;
            var result = await _roleService.UpdateRoleAsync(roleDto);
            if (!result) return BadRequest("Failed to update role");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var result = await _roleService.DeleteRoleAsync(id);
            if (!result) return BadRequest("Failed to delete role");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("permissions")]
        public async Task<IActionResult> GetPermissions()
        {
            var permissions = await _roleService.GetPermissionsAsync();
            return Ok(permissions);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("permissions/{id}")]
        public async Task<IActionResult> GetPermissionById(string id)
        {
            var permission = await _roleService.GetPermissionByIdAsync(id);
            if (permission == null) return NotFound();
            return Ok(permission);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("permissions")]
        public async Task<IActionResult> CreatePermission([FromBody] PermissionDto permissionDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _roleService.CreatePermissionAsync(permissionDto);
            if (!result) return BadRequest("Failed to create permission");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("permissions/{id}")]
        public async Task<IActionResult> UpdatePermission(string id, [FromBody] PermissionDto permissionDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            permissionDto.Id = id;
            var result = await _roleService.UpdatePermissionAsync(permissionDto);
            if (!result) return BadRequest("Failed to update permission");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("permissions/{id}")]
        public async Task<IActionResult> DeletePermission(string id)
        {
            var result = await _roleService.DeletePermissionAsync(id);
            if (!result) return BadRequest("Failed to delete permission");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> AssignPermissionToRole(string roleId, string permissionId)
        {
            var result = await _roleService.AssignPermissionToRoleAsync(roleId, permissionId);
            if (!result) return BadRequest("Failed to assign permission to role");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> RemovePermissionFromRole(string roleId, string permissionId)
        {
            var result = await _roleService.RemovePermissionFromRoleAsync(roleId, permissionId);
            if (!result) return BadRequest("Failed to remove permission from role");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{userId}/roles/{roleId}")]
        public async Task<IActionResult> AssignRoleToUser(string userId, string roleId)
        {
            var result = await _roleService.AssignRoleToUserAsync(userId, roleId);
            if (!result) return BadRequest("Failed to assign role to user");
            return Ok();
        }
    }
}