using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Dtos.User;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.Net;
using api.Models;
using OfficeOpenXml;
using api.Dtos.Role;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly Cloudinary _cloudinary;
        private readonly IJwtService _jwtService;
        private readonly ILogger<UserController> _logger;
        private readonly IBaseReponseService _baseReponseService;

        public UserController(
            IUserService Userervice,
            IConfiguration configuration,
            UserManager<User> userManager,
            IJwtService jwtService,
            ILogger<UserController> logger,
            IBaseReponseService baseReponseService
        )
        {
            _userService = Userervice;
            _configuration = configuration;
            _userManager = userManager;
            _jwtService = jwtService;
            _logger = logger;
            _baseReponseService = baseReponseService;

            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            var acc = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(acc);
        }



        /////////////////////// api/User/GenerateSignature ///////////////////////
        [HttpPost("GenerateSignature")]
        public async Task<IActionResult> GenerateSignature([FromBody] Dictionary<string, string> parameters)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(_baseReponseService.CreateModelStateErrorResponse("Invalid parameters.", ModelState));
                }

                var user = await _jwtService.GetUserFromTokenAsync();
                if (user == null)
                {
                    return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
                }

                var cloudName = _configuration["Cloudinary:CloudName"];
                var apiKey = _configuration["Cloudinary:ApiKey"];
                var apiSecret = _configuration["Cloudinary:ApiSecret"];

                if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
                {
                    return StatusCode(500, new { Message = "Cloudinary configuration is missing." });
                }

                // Generate signature
                var sortedParams = new SortedDictionary<string, string>(parameters);
                var signString = new StringBuilder();

                foreach (var param in sortedParams)
                {
                    signString.Append($"{param.Key}={param.Value}&");
                }

                if (signString.Length > 0)
                {
                    signString.Length--; // Remove the trailing '&' if it exists
                }

                using (var sha1 = new HMACSHA1(Encoding.UTF8.GetBytes(apiSecret)))
                {
                    var hash = sha1.ComputeHash(Encoding.UTF8.GetBytes(signString.ToString()));
                    var signature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                    _logger.LogInformation("Signature: " + signature);
                    _logger.LogInformation("API Key: " + apiKey);
                    _logger.LogInformation("Cloud Name: " + cloudName);

                    return Ok(new { Signature = signature, ApiKey = apiKey, CloudName = cloudName });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while generating signature.");
                return StatusCode(500, new { Message = "Internal server error." });
            }
        }



        /////////////////////// api/User/UploadImage ///////////////////////
        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string? username = null)
        {
            // Get the user by username if provided, otherwise get the current logged-in user
            var user = username != null ? await _userManager.FindByNameAsync(username) : await _jwtService.GetUserFromTokenAsync();

            // Check if the user is found
            if (user == null)
            {
                return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
            }

            // Check if the file is empty
            if (file == null || file.Length == 0)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("File is empty."));
            }

            // Check if the file size exceeds the limit
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("File size exceeds the limit."));
            }

            // Check if the file is an image
            try
            {
                // Upload image to Cloudinary
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                    UploadPreset = "WebDemoDK"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    // Update the user's profile picture
                    user.ProfilePicture = uploadResult.SecureUrl.AbsoluteUri;
                    await _userManager.UpdateAsync(user);

                    return Ok(new { url = uploadResult.SecureUrl });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while uploading image.");
                return StatusCode(500, new { Message = "An error occurred during upload." });
            }

            return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to upload image."));
        }



        /////////////////////// api/User/Get/{id} ///////////////////////
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(string id)
        {
            _logger.LogInformation($"Get User Request ID: {id}");
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("User not found."));
            }

            // Get the roles assigned to the user
            var roles = await _userManager.GetRolesAsync(user);

            // Get the permissions for each role
            var permissions = new List<string>();
            foreach (var role in roles)
            {
                var rolePermissions = await _userService.GetPermissionsForRoleAsync(role);
                permissions.AddRange(rolePermissions);
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new
                {
                    User = user,
                    Roles = roles,
                    Permissions = permissions
                },
                "User retrieved successfully."
            ));
        }



        /////////////////////// api/User/GetAll ///////////////////////
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll(int page = 1, int pageSize = 10)
        {
            var user = _jwtService.GetUserRolesAndPermissionsFromToken();
            if (user.UserId == null)
            {
                return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
            }

            // Truy vấn lấy tất cả người dùng chưa bị xóa, bao gồm UserRoles và RolePermissions cho mỗi User
            var query = _userManager.Users
                .Where(u => !u.IsDeleted)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
                            .ThenInclude(rp => rp.Permission)
                .Include(u => u.UserRoles) // Bao gồm UserRoles để lấy thông tin Role của người dùng
                .ThenInclude(ur => ur.Role) // Liên kết với Role
                .ThenInclude(r => r.RolePermissions) // Liên kết với RolePermissions
                .ThenInclude(rp => rp.Permission); // Liên kết với Permission

            // Lấy số lượng người dùng tổng để tính toán phân trang
            var totalUser = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalUser / (double)pageSize);

            // Áp dụng phân trang
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            // Creating the response with pagination info and list of users with roles and permissions
            var response = new
            {
                TotalUser = totalUser,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Users = users.Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    // Including UserRoles and RolePermissions for each user
                    UserRoles = u.UserRoles.Select(ur => new
                    {
                        ur.Role.Id,
                        ur.Role.Name,
                        Permissions = ur.Role.RolePermissions.Select(rp => new
                        {
                            rp.Permission.PermissionId,
                            rp.Permission.Name,
                            rp.Permission.Description
                        }).ToList()
                    }).ToList()
                }).ToList()
            };

            return Ok(_baseReponseService.CreateSuccessResponse(response, "Users retrieved successfully."));

        }


        /////////////////////// api/User/Create ///////////////////////
        [HttpPost("Create")]
        public async Task<IActionResult> CreateUser([FromBody] AddUserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseReponseService.CreateModelStateErrorResponse("Invalid parameters.", ModelState));
            }

            // Get the current logged-in user
            var user = await _jwtService.GetUserFromTokenAsync();
            if (user == null)
            {
                return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
            }

            var result = await _userService.AddUserAsync(userDto);
            if (!result)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to create user."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new { User = userDto },
                "User created successfully."
            ));
        }



        /////////////////////// api/User/Update ///////////////////////
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateUser(UpdateUserDto updateUserDto)
        {
            // _logger.LogInformation($"Update User Request Body: {JsonConvert.SerializeObject(updateUserDto)}");
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseReponseService.CreateModelStateErrorResponse("Invalid parameters.", ModelState));
            }

            var user = await _userManager.FindByIdAsync(updateUserDto.Id);
            if (user == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("User not found."));
            }

            var isExistingEmail = await _userService.CheckEmailExistsAsync(updateUserDto.Email);
            var isExistingUsername = await _userService.CheckUsernameExistsAsync(updateUserDto.UserName);

            if ((isExistingEmail && user.Email != updateUserDto.Email) ||
                (isExistingUsername && user.UserName != updateUserDto.UserName))
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Username or email already exists."));
            }

            var result = await _userService.UpdateUserAsync(user, updateUserDto);
            if (!result)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to update user."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new { User = user },
                "User updated successfully."
            ));
        }


        /////////////////////// api/User/GetPersonalInfo ///////////////////////
        [HttpGet("GetPersonalInfo")]
        public async Task<IActionResult> GetPersonalInfo()
        {
            var responseFromToken = _jwtService.GetUserRolesAndPermissionsFromToken();
            if (responseFromToken.UserId == null)
            {
                return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new
                {
                    UserId = responseFromToken.UserId,
                    UserName = responseFromToken.UserName,
                    Roles = responseFromToken.Roles,
                    Permissions = responseFromToken.Permissions,
                },
                "Personal information retrieved successfully."
            ));
        }



        /////////////////////// api/User/UpdatePersonalInfo ///////////////////////
        [HttpPost("UpdatePersonalInfo")]
        public async Task<IActionResult> UpdatePersonalInfo([FromBody] UpdatePersonalInfoDto personalInfoDto)
        {
            _logger.LogInformation("Updating personal information.");
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid parameters.");
                return BadRequest(_baseReponseService.CreateModelStateErrorResponse("Invalid parameters.", ModelState));
            }

            var userFromToken = _jwtService.GetUserRolesAndPermissionsFromToken();
            if (userFromToken.UserName == null)
            {
                return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
            }

            var userUpdating = await _userManager.FindByNameAsync(userFromToken.UserName);

            var result = await _userService.UpdatePersonalInfoAsync(userUpdating, personalInfoDto);
            if (!result)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to update personal information."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new { User = personalInfoDto },
                "Personal information updated successfully."
            ));
        }



        /////////////////////// api/User/DeleteAccount ///////////////////////
        [HttpPost("DeleteAccount")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userFromToken = _jwtService.GetUserRolesAndPermissionsFromToken();
            if (userFromToken.UserName == null)
            {
                return Unauthorized(_baseReponseService.CreateErrorResponse<object>("Invalid token or username claim not found."));
            }

            var user = await _userManager.FindByNameAsync(userFromToken.UserName);
            if (user == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("User not found."));
            }
            // Attempt to soft delete the user
            var result = await _userService.SoftDeleteUserAsync(user);

            if (!result)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to delete account."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new { User = user },
                "Account deleted successfully."
            ));
        }


        /////////////////////// api/User/Restore ///////////////////////
        [HttpPost("Restore")]
        public async Task<IActionResult> Restore(RestoreUserDto restoreUserDto)
        {
            // _logger.LogInformation("Restoring user.");
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseReponseService.CreateModelStateErrorResponse("Invalid parameters.", ModelState));
            }

            // Find the user by email and check if they are marked as deleted
            var user = await _userManager.Users
                .IgnoreQueryFilters()
                .Where(u => u.Email == restoreUserDto.Email && u.IsDeleted == true)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("User not found."));
            }

            var result = await _userService.Restore(user);
            if (!result)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to restore user."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new { User = user },
                "User restored successfully."
            ));
        }



        /////////////////////// api/User/Export/Excel ///////////////////////
        [HttpGet("Export/Excel")]
        public async Task<IActionResult> ExportUserToExcel()
        {
            var User = await _userService.GetUserAsync(); // Fetch User from your database

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("User");

                // Adding headers
                worksheet.Cells[1, 1].Value = "ID";
                worksheet.Cells[1, 2].Value = "Username";
                worksheet.Cells[1, 3].Value = "Email";
                worksheet.Cells[1, 4].Value = "Gender";

                // Adding user data
                int row = 2;
                foreach (var user in User)
                {
                    worksheet.Cells[row, 1].Value = user.Id;
                    worksheet.Cells[row, 2].Value = user.UserName;
                    worksheet.Cells[row, 3].Value = user.Email;
                    worksheet.Cells[row, 4].Value = user.Gender;
                    row++;
                }

                // Convert to byte array
                var fileContents = package.GetAsByteArray();

                // Return the Excel file as a download
                return File(fileContents, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "User.xlsx");
            }
        }



        /////////////////////// api/User/CheckUsernameEmail ///////////////////////
        [HttpGet("CheckUsernameEmail")]
        public async Task<IActionResult> CheckUsernameEmail(string username, string email)
        {
            var usernameExists = await _userService.CheckUsernameExistsAsync(username);
            var emailExists = await _userService.CheckEmailExistsAsync(email);

            return Ok(new { UsernameExists = usernameExists, EmailExists = emailExists });
        }



        /////////////////////// api/User/AssignRoleToUser ///////////////////////
        [HttpPost("AssignRoleToUser")]
        public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleToUserRequest request)
        {
            var result = await _userService.AssignRoleToUserAsync(request.UserId, request.RoleId);
            if (!result.Succeeded)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Failed to assign role to user."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(
                new { UserId = request.UserId, RoleId = request.RoleId },
                "Role assigned to user successfully."
            ));
        }



        /////////////////////// api/User/Search ///////////////////////
        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Search term cannot be empty."));
            }

            var users = await _userService.SearchUsersAsync(searchTerm);

            if (users == null || users.Count == 0)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("No users found matching the search term."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(users, "Search user successfully!"));
        }
    }
}