using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Order
{
    public class CreateOrderDto
    {
        public List<CreateOrderDetailDto> OrderDetails { get; set; }
        public string Status { get; set; } // Pending, Completed, etc.
        public decimal TotalAmount { get; set; }
    }
}