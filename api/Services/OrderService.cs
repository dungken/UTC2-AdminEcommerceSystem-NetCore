using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Order;
using api.Dtos.Payment;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
            var order = new Order
            {
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = dto.TotalAmount,
                UserId = dto.UserId,
                OrderDetails = dto.OrderDetails.Select(detail => new OrderDetail
                {
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    DiscountAmount = detail.DiscountAmount,
                    OrderId = detail.OrderId
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                UserId = dto.UserId,
                OrderDetails = order.OrderDetails.Select(detail => new OrderDetailDto
                {
                    Id = detail.Id,
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    DiscountAmount = detail.DiscountAmount,
                    Total = detail.Total
                }).ToList()
            };
        }

        public async Task<OrderDto> GetOrderByIdAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) throw new KeyNotFoundException("Order not found");

            return new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(detail => new OrderDetailDto
                {
                    Id = detail.Id,
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    DiscountAmount = detail.DiscountAmount,
                    Total = detail.Total
                }).ToList(),
                Payment = order.Payment == null ? null : new PaymentDto
                {
                    Id = order.Payment.Id,
                    Amount = order.Payment.Amount,
                    PaymentMethod = order.Payment.PaymentMethod,
                    PaymentDate = order.Payment.PaymentDate
                }
            };
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .ToListAsync();

            return orders.Select(order => new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(detail => new OrderDetailDto
                {
                    Id = detail.Id,
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    DiscountAmount = detail.DiscountAmount,
                    Total = detail.Total
                }).ToList()
            });
        }

        public async Task<bool> UpdateOrderStatusAsync(Guid orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) throw new KeyNotFoundException("Order not found");

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddToCartAsync(Guid orderId, List<CartItemDto> cartItems)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) throw new KeyNotFoundException("Order not found");

            foreach (var item in cartItems)
            {
                var orderDetail = order.OrderDetails.FirstOrDefault(od => od.ProductId == item.Id);
                if (orderDetail != null)
                {
                    orderDetail.Quantity += item.Quantity;
                }
                else
                {
                    order.OrderDetails.Add(new OrderDetail
                    {
                        ProductId = item.Id,
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        DiscountAmount = 0 // Assuming no discount for simplicity
                    });
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersByUserIdAsync(Guid userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(order => new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(detail => new OrderDetailDto
                {
                    Id = detail.Id,
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    DiscountAmount = detail.DiscountAmount,
                    Total = detail.Total
                }).ToList()
            });
        }
    }

}