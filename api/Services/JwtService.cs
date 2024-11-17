using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<JwtService> _logger;
        private readonly JwtSettings _jwtSettings;
        private readonly UserManager<User> _userManager;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public JwtService(
            IConfiguration configuration,
            ILogger<JwtService> logger,
            IHttpContextAccessor httpContextAccessor,
            UserManager<User> userManager
        )
        {
            _configuration = configuration;
            _logger = logger;
            _jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
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

            _logger.LogInformation($"Token {token}.");

            // Return the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Asynchronous method for token generation
        public async Task<string> GenerateJwtTokenAsync(User user, IList<Guid> roles, IList<Guid> permissions)
        {
            return await Task.FromResult(GenerateJwtToken(user, roles, permissions));
        }

        public async Task<User> GetUserFromTokenAsync()
        {
            var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            // Console.WriteLine("Token is: " + token);
            var userName = GetUserNameFromToken(token);
            return userName != null ? await _userManager.FindByNameAsync(userName) : null;
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

        public (string UserId, string UserName, List<Guid> Roles, List<Guid> Permissions) GetUserRolesAndPermissionsFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadToken(token) as JwtSecurityToken;
            if (jwtToken == null)
            {
                _logger.LogWarning("Invalid token format.");
                return (null, null, null, null);
            }

            // Retrieve user ID and username from claims
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var userName = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            // Retrieve roles from claims
            var roles = jwtToken.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => Guid.Parse(c.Value))
                .ToList();

            // Retrieve permissions from claims
            var permissions = jwtToken.Claims
                .Where(c => c.Type == "Permission")
                .Select(c => Guid.Parse(c.Value))
                .ToList();

            return (userId, userName, roles, permissions);
        }

        public (string UserId, string UserName, List<Guid> Roles, List<Guid> Permissions) GetUserRolesAndPermissionsFromToken()
        {
            var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            return GetUserRolesAndPermissionsFromToken(token);
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
