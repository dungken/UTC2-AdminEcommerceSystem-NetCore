using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key
        public decimal Amount { get; set; } // Payment amount
        public string PaymentMethod { get; set; } // Payment method (e.g., Cash, Card, etc.)
        public DateTime PaymentDate { get; set; } // Date of payment
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
    }
}