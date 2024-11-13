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

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Permission>>> GetPermissions()
        {
            var permissions = await _permissionService.GetPermissionsAsync();
            return Ok(permissions);
        }

        [HttpPost("Create")]
        public async Task<ActionResult> CreatePermission([FromBody] Permission permission)
        {
            if (permission.Name == null || permission.Description == null)
                return BadRequest("Invalid data.");

            await _permissionService.CreatePermissionAsync(permission);
            return CreatedAtAction(nameof(GetPermissions), new { id = permission.PermissionId }, permission);
        }

        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdatePermission(Guid id, [FromBody] Permission permission)
        {
            if (id != permission.PermissionId)
                return BadRequest("ID mismatch.");

            var updated = await _permissionService.UpdatePermissionAsync(id, permission);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeletePermission(Guid id)
        {
            var permission = await _permissionService.GetPermissionAsync(id);
            if (permission == null)
                return NotFound();

            await _permissionService.DeletePermissionAsync(id);
            return NoContent();
        }
    }
}