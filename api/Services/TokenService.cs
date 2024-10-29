using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Dtos.Role;
using api.Interfaces;
using api.Models;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace api.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _config = config;
            var signingKey = _config["JWT:SigningKey"];
            if (string.IsNullOrEmpty(signingKey))
            {
                throw new ArgumentNullException(nameof(signingKey), "JWT signing key is not configured.");
            }
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        }
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? throw new ArgumentNullException(nameof(user.Email))),
                new Claim(JwtRegisteredClaimNames.GivenName, user.UserName ?? throw new ArgumentNullException(nameof(user.UserName)))
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }



        public async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string idToken)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _config["Authentication:Google:ClientId"] ?? throw new ArgumentNullException("Google ClientId is not configured") }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }

        public async Task<JObject?> VerifyFacebookToken(string accessToken)
        {
            var httpClient = new HttpClient();
            var appAccessTokenResponse = await httpClient.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_config["Authentication:Facebook:AppId"]}&client_secret={_config["Authentication:Facebook:AppSecret"]}&grant_type=client_credentials");
            var appAccessTokenJson = JObject.Parse(appAccessTokenResponse);
            var appAccessToken = appAccessTokenJson?["access_token"]?.ToString() ?? throw new InvalidOperationException("Failed to retrieve access token from Facebook response.");

            var userAccessTokenValidationResponse = await httpClient.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={accessToken}&access_token={appAccessToken}");
            var userAccessTokenValidation = JObject.Parse(userAccessTokenValidationResponse);

            if (userAccessTokenValidation?["data"]?["is_valid"]?.Value<bool>() == true)
            {
                var userInfoResponse = await httpClient.GetStringAsync($"https://graph.facebook.com/me?fields=id,name,email&access_token={accessToken}");
                return JObject.Parse(userInfoResponse);
            }

            return null;
        }

        public string CreateToken(AppUser user, IEnumerable<RoleDto> roles)
        {
            var claims = new List<Claim>
            {
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? throw new ArgumentNullException(nameof(user.Email))),
            new Claim(JwtRegisteredClaimNames.GivenName, user.UserName ?? throw new ArgumentNullException(nameof(user.UserName)))
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

    }
}