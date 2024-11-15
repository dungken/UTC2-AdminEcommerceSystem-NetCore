using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Discount
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key
        public string Name { get; set; } // Discount name
        public decimal Percentage { get; set; } // Percentage discount
        public DateTime StartDate { get; set; } // Start date of the discount
        public DateTime EndDate { get; set; } // End date of the discount
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}