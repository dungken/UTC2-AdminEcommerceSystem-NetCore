using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Services
{
    public interface IJwtService
    {
        Task<string> GenerateJwtTokenAsync(User user, IList<Guid> roles, IList<Guid> permissions);
        Task<User> GetUserFromTokenAsync();
        (string UserId, string UserName, List<Guid> Roles, List<Guid> Permissions) GetUserRolesAndPermissionsFromToken();
        void LogCurrentUser(string token);
    }
}