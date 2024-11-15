using api.Services;
using Microsoft.AspNetCore.Mvc;


namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IImageService _imageService;
        private readonly ILogger<ImagesController> _logger;
        private readonly IBaseReponseService _baseResponseService;

        public ImagesController(
            IImageService imageService,
            ILogger<ImagesController> logger,
            IBaseReponseService baseResponseService
        )
        {
            _imageService = imageService;
            _logger = logger;
            _baseResponseService = baseResponseService;
        }

        // Upload multiple images for a product
        [HttpPost("UploadMultiple")]
        public async Task<IActionResult> UploadImages([FromForm] IFormFile[] files, [FromForm] Guid productId, [FromForm] string altText)
        {
            try
            {
                if (files == null || files.Length == 0)
                {
                    return BadRequest(_baseResponseService.CreateErrorResponse<object>("No files uploaded."));
                }

                // Upload images using the service
                var images = await _imageService.UploadImagesAsync(files, productId, altText);
                return Ok(_baseResponseService.CreateSuccessResponse(images, "Images uploaded successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading images.");
                return StatusCode(500, new { Message = "Internal server error." });
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