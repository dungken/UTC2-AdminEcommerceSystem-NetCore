using api.Dtos.Order;
using api.Services;
using Microsoft.AspNetCore.Mvc;


namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IBaseReponseService _baseResponseService;

        public OrderController(
            IOrderService orderService,
            IBaseReponseService baseResponseService
            )
        {
            _orderService = orderService;
            _baseResponseService = baseResponseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var result = await _orderService.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetOrderById), new { id = result.Id }, result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid order ID."));
            }
            var result = await _orderService.GetOrderByIdAsync(id);
            if (result == null)
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("Order not found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(result, "Order found."));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var result = await _orderService.GetAllOrdersAsync();
            if (result == null || !result.Any())
            {
                return NotFound(_baseResponseService.CreateErrorResponse<object>("No orders found."));
            }
            return Ok(_baseResponseService.CreateSuccessResponse(result, "Orders found."));
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] string status)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid order ID."));
            }
            if (string.IsNullOrEmpty(status))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid status."));
            }

            await _orderService.UpdateOrderStatusAsync(id, status);
            return NoContent();
        }
    }

}