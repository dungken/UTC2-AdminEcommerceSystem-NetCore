using api.Dtos.Order;
using api.Services;
using api.Utils;
using Microsoft.AspNetCore.Mvc;


namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IBaseReponseService _baseResponseService;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public OrderController(
            IOrderService orderService,
            IBaseReponseService baseResponseService,
            IEmailService emailService,
            IUserService userService
            )
        {
            _orderService = orderService;
            _baseResponseService = baseResponseService;
            _emailService = emailService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            // Validate the incoming request
            if (dto == null)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid request."));
            }
            if (dto.OrderDetails == null || !dto.OrderDetails.Any())
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid order details."));
            }
            if (dto.TotalAmount <= 0)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid total amount."));
            }
            if (dto.UserId == Guid.Empty)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid user ID."));
            }

            var result = await _orderService.CreateOrderAsync(dto);
            if (result == null)
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Failed to create order."));
            }

            // Find email by userid
            var user = await _userService.GetUserByIdAsync(dto.UserId.ToString());

            if (user == null || string.IsNullOrEmpty(user.Email))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("User not found or email is invalid."));
            }

            // Send mail to customer to confirm order
            string content = $@"
                <p>Dear {user.FirstName} {user.LastName},</p>
                <p>Thank you for shopping with us! Your order has been placed successfully.</p>
                <p><strong>Order Details:</strong></p>
                <ul>
                    <li><strong>Order Number:</strong> {result.Id}</li>
                    <li><strong>Date:</strong> {result.OrderDate}</li>
                    <li><strong>Total Amount:</strong> {FormatCurrencyVND.FormatToVND(result.TotalAmount)}</li>
                </ul>
                <p><strong>Products:</strong></p>
                <table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {string.Join("", result.OrderDetails.Select(item => $@"
                        <tr>
                            <td>{item.ProductId}</td>
                            <td>{item.Quantity}</td>
                            <td>{FormatCurrencyVND.FormatToVND(item.UnitPrice)}</td>
                            <td>{FormatCurrencyVND.FormatToVND(item.Quantity * item.UnitPrice)}</td>
                        </tr>"))}
                    </tbody>
                </table>
                <p>We are currently processing your order and will notify you once it has been shipped.</p>
                <p>If you have any questions or need assistance, feel free to contact our customer service at support@example.com.</p>
                <p>Thank you for choosing our service!</p>
                <p>Best regards,</p>
                <p><strong>Coolmate Team Sales</strong></p>
            ";


            await _emailService.SendEmailAsync(user.Email, "Order Confirmation", content);

            return Ok(_baseResponseService.CreateSuccessResponse(result, "Order created."));
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

        // Get All Order by User ID
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllOrdersByUserId(Guid userId)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                return BadRequest(_baseResponseService.CreateErrorResponse<object>("Invalid user ID."));
            }
            var result = await _orderService.GetAllOrdersByUserIdAsync(userId);
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