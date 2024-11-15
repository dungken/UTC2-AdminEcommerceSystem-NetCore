using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Payment;

namespace api.Services
{
    public interface IPaymentService
    {
        Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto dto);
        Task<PaymentDto> GetPaymentByOrderIdAsync(Guid orderId);
    }
}