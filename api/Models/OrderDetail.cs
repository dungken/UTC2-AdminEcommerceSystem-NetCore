using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class OrderDetail
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key
        public int Quantity { get; set; } // Quantity of product
        public decimal UnitPrice { get; set; } // Price per unit
        public decimal DiscountAmount { get; set; } // Discount applied to this item
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Keys
        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        // Computed Property
        public decimal Total => Quantity * UnitPrice - DiscountAmount; // Total price for this order detail
    }
}