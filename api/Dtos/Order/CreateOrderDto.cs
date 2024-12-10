using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Dtos.Order
{
    public class CreateOrderDto
    {
        public List<CreateOrderDetailDto> OrderDetails { get; set; }
        public string? Status { get; set; } = "Pending";
        public decimal TotalAmount { get; set; }
        public Guid UserId { get; set; }
    }
}