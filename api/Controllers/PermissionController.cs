using api.Dtos.Role;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;
        private readonly IBaseReponseService _baseResponseService;

        public PermissionController(
            IPermissionService permissionService,
            IBaseReponseService baseReponseService)
        {
            _permissionService = permissionService;
            _baseResponseService = baseReponseService;
        }

        ///////////////////////////////// api/Permission/GetAll /////////////////////////////////
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Permission>>> GetPermissions()
        {
            var permissions = await _permissionService.GetPermissionsAsync();
            return Ok(_baseResponseService.CreateSuccessResponse(permissions, "Get permissions successfully!"));
        }

        ///////////////////////////////// api/Permission/GetAllWithRoles /////////////////////////////////
        [HttpGet("GetAllWithRoles")]
        public async Task<ActionResult<IEnumerable<PermissionWithRolesDto>>> GetPermissionsWithRoles()
        {
            var permissionsWithRoles = await _permissionService.GetPermissionsWithRolesAsync();
            return Ok(_baseResponseService.CreateSuccessResponse(permissionsWithRoles, "Get permissions with roles successfully!"));
        }

        /////////////////////////////// api/Permission/{PermissionId} ///////////////////////////////
        [HttpGet("{permissionId}")]
        public async Task<IActionResult> GetById([FromRoute] Guid permissionId)
        {
            var permission = await _permissionService.GetPermissionByIdAsync(permissionId);
            if (permission == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Permission not found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(permission, "Get permission by ID successfully!"));
        }

        ////////////////////////////// api/Permission/CreateOrUpdate /////////////////////////////
        [HttpPost("CreateOrUpdate")]
        public async Task<IActionResult> CreateOrUpdatePermission([FromBody] CreatePermissionDto permissionDto)
        {
            if (permissionDto == null || string.IsNullOrEmpty(permissionDto.Name))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid data!"));
            }

            var permission = await _permissionService.CreateOrUpdatePermissionAsync(permissionDto);

            if (permission == null)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Failed to create or update the permission."));
            }

            return Ok(_baseResponseService.CreateSuccessResponse(permission, "Create or Update permission successfully!"));
        }

        ////////////////////////////// api/Permission/Delete /////////////////////////////
        [HttpDelete("Delete/{permissionId}")]
        public async Task<IActionResult> Delete(Guid permissionId)
        {
            var result = await _permissionService.DeletePermissionAsync(permissionId);

            if (!result)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Failed to delete permission."));
            }

            return Ok(_baseResponseService.CreateSuccessResponse(result, "Delete permission successfully!"));
        }
    }
}