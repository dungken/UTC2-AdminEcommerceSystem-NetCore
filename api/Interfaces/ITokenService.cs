using api.Dtos.Role;
using api.Models;
using Google.Apis.Auth;
using Newtonsoft.Json.Linq;

namespace api.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
        Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string idToken);
        Task<JObject?> VerifyFacebookToken(string accessToken);
        string CreateToken(AppUser user, IEnumerable<RoleDto> roles);

    }
}