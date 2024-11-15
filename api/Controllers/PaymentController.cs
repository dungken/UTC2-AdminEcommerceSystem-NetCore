using api.Dtos.Order;
using api.Dtos.Payment;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IBaseReponseService _baseResponseService;

        public PaymentController(
            IPaymentService paymentService,
            IBaseReponseService baseResponseService
            )
        {
            _paymentService = paymentService;
            _baseResponseService = baseResponseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid payment data."));
            }
            var result = await _paymentService.CreatePaymentAsync(dto);
            if (result == null)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Payment not created."));
            }
            return CreatedAtAction(nameof(GetPaymentByOrderId), new { orderId = dto.OrderId }, result);
        }


        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetPaymentByOrderId(Guid orderId)
        {
            if (orderId == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid order ID."));
            }
            var result = await _paymentService.GetPaymentByOrderIdAsync(orderId);
            if (result == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Payment not found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(result, "Payment found."));
        }
    }

}