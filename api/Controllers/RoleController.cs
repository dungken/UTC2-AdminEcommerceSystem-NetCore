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
        private readonly IBaseReponseService _baseReponseService;

        public RoleController(
            IRoleService roleService,
            IRolePermissionService rolePermissionService,
            IBaseReponseService baseReponseService
            )
        {
            _roleService = roleService;
            _rolePermissionService = rolePermissionService;
            _baseReponseService = baseReponseService;
        }



        ///////////////////////////////// api/Role/GetAll /////////////////////////////////
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();
            return Ok(_baseReponseService.CreateSuccessResponse(roles, "Get all roles successfully!"));
        }



        /////////////////////////////// api/Role/{RoleId} ///////////////////////////////
        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetById([FromRoute] Guid roleId)
        {
            var role = await _roleService.GetRoleByIdAsync(roleId);
            if (role == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("No data."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(role, "Get role by ID successfully!"));
        }



        ////////////////////////////// api/Role/CreateOrUpdate /////////////////////////////
        [HttpPost("CreateOrUpdate")]
        public async Task<IActionResult> CreateOrUpdateRole([FromBody] CreateRoleDto roleDto)
        {
            // Validate the incoming request
            if (roleDto == null || string.IsNullOrEmpty(roleDto.Name) || roleDto.Permissions == null || !roleDto.Permissions.Any())
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Invalid data!"));
            }


            var role = await _roleService.CreateOrUpdateRoleAsync(roleDto);

            if (role == null)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to create or update the role."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(role, "Create or Update successfully!"));
        }



        ////////////////////////////// api/Role/Delete /////////////////////////////
        [HttpDelete("Delete/{roleId}")]
        public async Task<IActionResult> Delete(Guid roleId)
        {
            var result = await _roleService.DeleteRoleAsync(roleId);

            if (!result)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Failed to delete role."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(result, "Delete role successfully!"));
        }



        /////////////////////////////// api/Role/AssignPermissions ///////////////////////////////
        [HttpPost("AssignPermissions")]
        public async Task<IActionResult> AssignPermissions([FromBody] AssignPermissionsRequest request)
        {
            // Validate the incoming request
            if (request.RoleId == Guid.Empty || !request.PermissionIds.Any())
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Invalid data."));
            }

            var result = await _rolePermissionService.AssignPermissionsToRoleAsync(request.RoleId, request.PermissionIds);

            if (!result)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to assign permissions!"));
            }


            return Ok(_baseReponseService.CreateSuccessResponse<object>(null, "Permissions assigned successfully!"));
        }
    }
}
