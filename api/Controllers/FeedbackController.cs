using api.Dtos.Product;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserService _userService; // To fetch logged-in user's info
        private readonly IBaseReponseService _baseResponseService;
        private readonly IJwtService _jwtService;

        public FeedbackController(
            IFeedbackService feedbackService,
            IUserService userService,
            IBaseReponseService baseResponseService,
            IJwtService jwtService
        )
        {
            _feedbackService = feedbackService;
            _userService = userService;
            _baseResponseService = baseResponseService;
            _jwtService = jwtService;
        }

        // Create feedback
        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackDto dto)
        {
            var userLoggedIn = await _jwtService.GetUserFromTokenAsync();
            if (userLoggedIn == null)
            {
                return Unauthorized(_baseResponseService.CreateErrorResponse<object>("Unauthorized"));
            }
            var result = await _feedbackService.CreateFeedbackAsync(dto, userLoggedIn.Id);
            return CreatedAtAction(nameof(GetFeedbackById), new { id = result.Id }, result);
        }

        // Update feedback
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeedback(Guid id, [FromBody] UpdateFeedbackDto dto)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid feedback ID."));
            }
            var result = await _feedbackService.UpdateFeedbackAsync(id, dto);
            if (result == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Feedback not found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(result, "Feedback updated successfully."));
        }

        // Delete feedback
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid feedback ID."));
            }
            await _feedbackService.DeleteFeedbackAsync(id);
            return NoContent(); // Successful deletion
        }

        // Get feedback by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeedbackById(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid feedback ID."));
            }
            var result = await _feedbackService.GetFeedbackByIdAsync(id);
            if (result == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Feedback not found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(result, "Feedback fetched successfully."));
        }

        // Get all feedbacks for a product
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetFeedbacksForProduct(Guid productId)
        {
            if (productId == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid product ID."));
            }
            var result = await _feedbackService.GetFeedbacksForProductAsync(productId);
            if (result == null || !result.Any())
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("No feedbacks found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(result, "Feedbacks fetched successfully."));
        }
    }
}