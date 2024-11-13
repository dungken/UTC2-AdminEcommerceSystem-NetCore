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

        // Phương thức bất đồng bộ để tạo JWT token với roles và permissions
        Task<string> GenerateJwtTokenAsync(User user, IList<Guid> roles, IList<Guid> permissions);

        // Phương thức để lấy tên người dùng từ token
        string GetUserNameFromToken(string token);

        // Phương thức để ghi lại thông tin của người dùng từ token (Log)
        void LogCurrentUser(string token);
    }
}