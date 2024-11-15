using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Dtos.Discount;


namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountsController : ControllerBase
    {
        private readonly IDiscountService _discountService;
        private readonly IBaseReponseService _baseReponseService;

        public DiscountsController(
            IDiscountService discountService,
            IBaseReponseService baseReponseService
            )
        {
            _discountService = discountService;
            _baseReponseService = baseReponseService;
        }

        // GET: api/Discounts
        [HttpGet]
        public async Task<IActionResult> GetAllDiscounts()
        {
            var discounts = await _discountService.GetAllDiscountsAsync();
            return Ok(_baseReponseService.CreateSuccessResponse(discounts));
        }

        // GET: api/Discounts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDiscountById(Guid id)
        {
            var discount = await _discountService.GetDiscountByIdAsync(id);
            if (discount == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Discount not found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(discount));
        }

        // POST: api/Discounts
        [HttpPost]
        public async Task<IActionResult> CreateDiscount([FromBody] CreateDiscountDto discountDto)
        {
            if (discountDto == null)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Discount data is required."));
            }

            var createdDiscount = await _discountService.CreateDiscountAsync(discountDto);
            return CreatedAtAction(nameof(GetDiscountById), new { id = createdDiscount.Id }, createdDiscount);
        }

        // PUT: api/Discounts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDiscount(Guid id, [FromBody] CreateDiscountDto discountDto)
        {
            var updatedDiscount = await _discountService.UpdateDiscountAsync(id, discountDto);
            if (updatedDiscount == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Discount not found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(updatedDiscount));
        }

        // DELETE: api/Discounts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscount(Guid id)
        {
            var success = await _discountService.DeleteDiscountAsync(id);
            if (!success)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Discount not found."));
            }
            return NoContent();
        }
    }

}