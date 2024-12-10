using System.Net;
using api.Data;
using api.Models;
using api.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;


namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IImageService _imageService;
        private readonly ILogger<ImagesController> _logger;
        private readonly Cloudinary _cloudinary;
        private readonly IBaseReponseService _baseResponseService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public ImagesController(
            IImageService imageService,
            ILogger<ImagesController> logger,
            Cloudinary cloudinary,
            IBaseReponseService baseResponseService,
            ApplicationDbContext context,
            IConfiguration configuration
        )
        {
            _imageService = imageService;
            _logger = logger;
            _cloudinary = cloudinary;
            _baseResponseService = baseResponseService;
            _context = context;
            _configuration = configuration;
            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                _logger.LogError("Cloudinary configuration is missing: CloudName={CloudName}, ApiKey={ApiKey}, ApiSecret={ApiSecret}",
                    cloudName, apiKey, apiSecret);
            }


            var acc = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(acc);


        }


        [HttpPost("UploadMultiple")]
        public async Task<IActionResult> UploadMultipleImages([FromForm] IFormFile[] files, [FromForm] Guid productId, [FromForm] string altText)
        {
            if (files == null || files.Length == 0)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("No files uploaded."));
            }

            // if (files.Any(file => file.Length > 5 * 1024 * 1024))
            // {
            //     return BadRequest(_baseResponseService.CreateErrorResponse<object>("One or more files exceed the size limit."));
            // }

            if (files.Any(file => !file.ContentType.StartsWith("image/")))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("One or more files are not valid images."));
            }

            List<object> uploadedImages = new List<object>();
            try
            {
                foreach (var file in files)
                {
                    if (file == null || file.Length == 0) continue;

                    // Upload each image to Cloudinary
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, file.OpenReadStream()),
                        UploadPreset = "WebDemoDK"
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.StatusCode == HttpStatusCode.OK)
                    {
                        // Create image record in the database
                        var image = new Image
                        {
                            Id = Guid.NewGuid(),
                            Url = uploadResult.SecureUrl.AbsoluteUri,
                            AltText = altText,
                            ProductId = productId,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        _context.Add(image);
                        await _context.SaveChangesAsync();

                        // Add the uploaded image details to the response
                        uploadedImages.Add(new
                        {
                            imageId = image.Id,
                            url = image.Url,
                            altText = image.AltText,
                            productId = image.ProductId,
                            createdAt = image.CreatedAt
                        });
                    }
                    else
                    {
                        _logger.LogWarning("Image upload failed for file: {FileName}", file.FileName);
                    }
                }

                return Ok(_baseResponseService.CreateSuccessResponse(uploadedImages, "Images uploaded successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while uploading images.");
                return StatusCode(500, new { Message = "An error occurred during upload." });
            }
        }


        // Get images by Product ID
        [HttpGet("GetByProductId/{productId}")]
        public async Task<IActionResult> GetImagesByProductId(Guid productId)
        {
            if (productId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid product ID." });
            }
            try
            {
                var images = await _imageService.GetImagesByProductIdAsync(productId);
                if (images == null || !images.Any())
                {
                    return NotFound(_baseResponseService.CreateErrorResponse<object>("No images found."));
                }

                return Ok(_baseResponseService.CreateSuccessResponse(images, "Images fetched successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching images.");
                return StatusCode(500, new { Message = "Internal server error." });
            }
        }

        // Update multiple images for a product
        [HttpPut("UpdateMultiple")]
        public async Task<IActionResult> UpdateImages([FromForm] Guid productId, [FromForm] IFormFile[] newFiles, [FromForm] IEnumerable<Guid> imageIdsToDelete, [FromForm] string altText)
        {
            try
            {
                if (newFiles == null || newFiles.Length == 0)
                {
                    return BadRequest(_baseResponseService.CreateErrorResponse<object>("No files uploaded."));
                }

                var updatedImages = await _imageService.UpdateImagesAsync(productId, newFiles, imageIdsToDelete, altText);
                return Ok(_baseResponseService.CreateSuccessResponse(updatedImages, "Images updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating images.");
                return StatusCode(500, new { Message = "Internal server error." });
            }
        }

        // Delete image by ID
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteImage(Guid id)
        {
            try
            {
                await _imageService.DeleteImageAsync(id);
                var result = true; // Assuming the method always succeeds
                if (result)
                {
                    return Ok(_baseResponseService.CreateSuccessResponse(result, "Image deleted successfully."));
                }
                else
                {
                    return NotFound(new { Message = "Image not found." });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting image.");
                return StatusCode(500, new { Message = "Internal server error." });
            }
        }
    }

}