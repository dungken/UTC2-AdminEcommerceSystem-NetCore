using api.Dtos.Role;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolePermissionController : ControllerBase
    {
        private readonly IRolePermissionService _rolePermissionService;

        public RolePermissionController(IRolePermissionService rolePermissionService)
        {
            _rolePermissionService = rolePermissionService;
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
