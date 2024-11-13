using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Services;
using Microsoft.AspNetCore.Authorization;

namespace api.Auth
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IUserPermissionService _userPermissionService;

        public PermissionHandler(IUserPermissionService userPermissionService)
        {
            _userPermissionService = userPermissionService;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                context.Fail();
                return;
            }

            // Kiểm tra quyền của người dùng từ cơ sở dữ liệu
            var hasPermission = await _userPermissionService.HasPermissionAsync(userId, requirement.Permission);

            if (hasPermission)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            await Task.CompletedTask;
        }
    }

}