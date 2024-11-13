using api.Dtos.Role;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IRolePermissionService _rolePermissionService;

        public RoleController(IRoleService roleService, IRolePermissionService rolePermissionService)
        {
            _roleService = roleService;
            _rolePermissionService = rolePermissionService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var role = await _roleService.GetRoleByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }

        [HttpPost("CreateOrUpdate")]
        public async Task<IActionResult> CreateOrUpdateRole([FromBody] CreateRoleDto roleDto)
        {
            if (roleDto == null || string.IsNullOrEmpty(roleDto.Name) || roleDto.Permissions == null || !roleDto.Permissions.Any())
            {
                return BadRequest("Invalid role data.");
            }
            var role = await _roleService.CreateOrUpdateRoleAsync(roleDto);

            if (role != null)
            {
                return Ok(role); // Return the updated or created role
            }
            else
            {
                return BadRequest("Failed to create or update the role.");
            }
        }

        [HttpDelete("Delete/{roleId}")]
        public async Task<IActionResult> DeleteRole(Guid roleId)
        {
            var result = await _roleService.DeleteRoleAsync(roleId);

            if (!result)
            {
                return NotFound(); // Trả về 404 nếu role không tìm thấy
            }

            return NoContent(); // Trả về 204 No Content nếu xóa thành công
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignPermissionToRole([FromBody] RolePermissionDto dto)
        {
            var resultMessage = await _rolePermissionService.AssignPermissionToRoleAsync(dto);
            return resultMessage == "Permission assigned to role successfully."
                ? Ok(resultMessage)
                : NotFound(resultMessage);
        }
    }
}
