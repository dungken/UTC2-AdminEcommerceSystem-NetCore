using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Services
{
    public interface IJwtService
    {
        // Phương thức đồng bộ để tạo JWT token với roles và permissions
        // string GenerateJwtToken(User user, IList<string> roles = null, IList<string> permissions = null);

        // Phương thức đồng bộ tạo JWT token cho user mà không có roles và permissions
        // string GenerateJwtToken(User user);

        Task<string> GenerateJwtTokenAsync(User user, IList<Guid> roles, IList<Guid> permissions);
        Task<User> GetUserFromTokenAsync();
        (string UserId, string UserName, List<Guid> Roles, List<Guid> Permissions) GetUserRolesAndPermissionsFromToken();
        void LogCurrentUser(string token);
    }
}