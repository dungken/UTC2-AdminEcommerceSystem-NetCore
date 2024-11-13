using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<JwtService> _logger;
        private readonly JwtSettings _jwtSettings;

        public JwtService(IConfiguration configuration, ILogger<JwtService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();
        }

        public string GenerateJwtToken(User user, IList<Guid> roles = null, IList<Guid> permissions = null)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            // Add roles to claims
            if (roles != null && roles.Any())
            {
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.ToString())));
            }

            // Add permissions to claims
            if (permissions != null && permissions.Any())
            {
                claims.AddRange(permissions.Select(permission => new Claim("Permission", permission.ToString())));
            }

            // Create signing credentials
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Generate the token
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryInMinutes),
                signingCredentials: creds
            );

            // Return the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        // public string GenerateJwtToken(User user, IList<string> roles = null, IList<string> permissions = null)
        // {
        //     return GenerateJwtToken(user, roles, permissions);
        // }

        // Asynchronous method for token generation
        public async Task<string> GenerateJwtTokenAsync(User user, IList<Guid> roles, IList<Guid> permissions)
        {
            return await Task.FromResult(GenerateJwtToken(user, roles, permissions));
        }

        // Get user name from JWT token
        public string GetUserNameFromToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("Token is null or empty.");
                return null;
            }

            var handler = new JwtSecurityTokenHandler();
            if (!(handler.ReadToken(token) is JwtSecurityToken jwtToken))
            {
                _logger.LogWarning("Invalid token format.");
                return null;
            }

            var userName = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name)?.Value;
            if (userName == null)
            {
                _logger.LogWarning("Username claim not found in token.");
            }

            return userName;
        }

        // Log information about the current user from token
        public void LogCurrentUser(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("Token is null or empty.");
                return;
            }

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jwtToken == null)
            {
                _logger.LogWarning("Invalid token format.");
                return;
            }

            var userId = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
            var userName = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name)?.Value;
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;

            if (userId != null)
                _logger.LogInformation($"User ID: {userId}");
            else
                _logger.LogWarning("User ID claim not found in token.");

            if (userName != null)
                _logger.LogInformation($"Username: {userName}");
            else
                _logger.LogWarning("Username claim not found in token.");

            if (email != null)
                _logger.LogInformation($"Email: {email}");
            else
                _logger.LogWarning("Email claim not found in token.");
        }
    }
}
