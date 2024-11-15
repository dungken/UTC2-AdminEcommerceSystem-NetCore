using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Payment;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto dto)
        {
            var payment = new Payment
            {
                OrderId = dto.OrderId,
                Amount = dto.Amount,
                PaymentMethod = dto.PaymentMethod,
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return new PaymentDto
            {
                Id = payment.Id,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate
            };
        }

        public async Task<PaymentDto> GetPaymentByOrderIdAsync(Guid orderId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (payment == null) throw new KeyNotFoundException("Payment not found");

            return new PaymentDto
            {
                Id = payment.Id,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate
            };
        }
    }

}