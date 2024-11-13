using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api.Services;
using api.Dtos.User;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.Net;
using api.Dtos.Account;
using api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.ComponentModel.DataAnnotations.Schema;
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

        public UserController(IUserService Userervice, IConfiguration configuration, UserManager<User> userManager, IJwtService jwtService, ILogger<UserController> logger)
        {
            _userService = Userervice;
            _configuration = configuration;
            _userManager = userManager;
            _jwtService = jwtService;
            _logger = logger;

            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            var acc = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(acc);
        }

        [HttpPost("GenerateSignature")]
        public async Task<IActionResult> GenerateSignature([FromBody] Dictionary<string, string> parameters)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                // _logger.LogInformation("Token: " + token);
                var userName = _jwtService.GetUserNameFromToken(token);
                if (userName == null)
                    return Unauthorized(new { Message = "Invalid token or username claim not found." });

                var user = await _userManager.FindByNameAsync(userName);
                if (user == null)
                    return NotFound(new { Message = "User not found." });


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

                    // _logger.LogInformation("Signature: " + signature);
                    // _logger.LogInformation("API Key: " + apiKey);
                    // _logger.LogInformation("Cloud Name: " + cloudName);

                    return Ok(new
                    {
                        signature,
                        apiKey,
                        cloudName
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, new { Message = "Internal server error." });
            }
        }

        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string? username = null)
        {
            // Kiểm tra nếu có username thì tìm user theo username, nếu không lấy user hiện tại từ token
            var user = username != null
                ? await _userManager.FindByNameAsync(username)
                : await GetUserFromTokenAsync();

            if (user == null)
                return NotFound(CreateErrorResponse("User not found or invalid token."));

            if (file == null || file.Length == 0)
                return BadRequest(CreateErrorResponse("No file selected."));

            if (file.Length > 5 * 1024 * 1024) // Giới hạn kích thước file 5 MB
                return BadRequest(CreateErrorResponse("File size exceeds the limit."));

            try
            {
                // Upload ảnh lên cloud storage
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                    UploadPreset = "WebDemoDK"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    // Cập nhật URL ảnh đại diện của user trong database
                    user.ProfilePicture = uploadResult.SecureUrl.AbsoluteUri;
                    await _userManager.UpdateAsync(user);

                    return Ok(new { url = uploadResult.SecureUrl });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred during upload." });
            }

            return BadRequest(CreateErrorResponse("Failed to upload image."));
        }



        [HttpPost("Create")]
        public async Task<IActionResult> CreateUser([FromBody] AddUserDto userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("Invalid token or username claim not found."));

            var result = await _userService.AddUserAsync(userDto);
            if (result)
                return Ok(new { Status = "success", Message = "User created successfully." });

            return BadRequest(CreateErrorResponse("Failed to create user."));
        }

        // Get personal information currently logged in user
        [HttpGet("GetPersonalInfo")]
        public async Task<IActionResult> GetPersonalInfo()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("Invalid token or username claim not found."));

            return Ok(new
            {
                data = new
                {
                    User = user
                },
                Status = "success",
                Message = "Personal information retrieved successfully."
            });
        }

        // Update personal information currently logged in user
        [HttpPut("UpdatePersonalInfo")]
        public async Task<IActionResult> UpdatePersonalInfo([FromBody] UpdatePersonalInfoDto personalInfoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("Invalid token or username claim not found."));

            var result = await _userService.UpdatePersonalInfoAsync(user, personalInfoDto);
            if (result)
                return Ok(CreateSuccessResponse("Personal information updated successfully."));

            return BadRequest(CreateErrorResponse("Failed to update personal information."));
        }

        [HttpPost("DeleteAccount")]
        public async Task<IActionResult> DeleteAccount(string username = null)
        {
            Console.WriteLine("Username: " + username);
            User user;


            if (!string.IsNullOrEmpty(username))
            {
                // Find the user by the provided username
                user = await _userManager.FindByNameAsync(username);
                if (user == null)
                    return NotFound(CreateErrorResponse("User not found."));
            }
            else
            {
                // Get the current logged-in user
                user = await GetUserFromTokenAsync();
                if (user == null)
                    return Unauthorized(CreateErrorResponse("Invalid token or username claim not found."));
            }

            // Attempt to soft delete the user
            var result = await _userService.SoftDeleteUserAsync(user);
            Console.WriteLine("Result: " + user.IsDeleted);

            if (result)
                return Ok(new { status = 200, message = "Account deleted successfully." });

            return BadRequest(CreateErrorResponse("Failed to delete account."));
        }

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

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("Invalid token or username claim not found."));

            var result = await _userService.UpdateUserAsync(userDto);
            if (result)
                return Ok(CreateSuccessResponse("User updated successfully."));

            return BadRequest(CreateErrorResponse("Failed to update user."));
        }

        private object CreateSuccessResponse(string message) => Ok(new { status = "success", message });

        private object CreateErrorResponse(string message, IEnumerable<IdentityError> errors = null)
        => new
        {
            status = "error",
            message,
            errors = errors?.Select(e => e.Description) ?? null
        };

        private async Task<User> GetUserFromTokenAsync()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var userName = _jwtService.GetUserNameFromToken(token);
            return userName != null ? await _userManager.FindByNameAsync(userName) : null;
        }

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found." });

            return Ok(user);
        }


        [HttpGet("CheckUsernameEmail")]
        public async Task<IActionResult> CheckUsernameEmail(string username, string email)
        {
            var usernameExists = await _userService.CheckUsernameExistsAsync(username);
            var emailExists = await _userService.CheckEmailExistsAsync(email);

            return Ok(new { UsernameExists = usernameExists, EmailExists = emailExists });
        }

        [HttpGet("GetAllUser")]
        public async Task<IActionResult> GetAllUser(int page = 1, int pageSize = 10)
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
                return Unauthorized(CreateErrorResponse("Invalid token or username claim not found."));

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

            // Tạo response với thông tin phân trang và danh sách người dùng
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
                    // Thêm thông tin UserRoles và RolePermissions cho mỗi người dùng
                    UserRoles = u.UserRoles.Select(ur => new
                    {
                        ur.Role.Id,
                        ur.Role.Name,
                        // Lấy các Permission của Role này
                        Permissions = ur.Role.RolePermissions
                            .Select(rp => new
                            {
                                rp.Permission.PermissionId,
                                rp.Permission.Name,
                                rp.Permission.Description
                            }).ToList()
                    }).ToList()
                })
            };

            return Ok(response);
        }




        [HttpPost("AssignRoleToUser")]
        public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleToUserRequest request)
        {
            try
            {
                var result = await _userService.AssignRoleToUserAsync(request.UserId, request.RoleId);
                if (result.Succeeded)
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return BadRequest("Error assigning role.");
        }
    }
}