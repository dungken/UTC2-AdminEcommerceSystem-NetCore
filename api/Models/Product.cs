using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public Guid CategoryId { get; set; } // Linked category ID
        public Category Category { get; set; }

        // Navigation Properties
        public ICollection<Color> Colors { get; set; } = new List<Color>();
        public ICollection<Size> Sizes { get; set; } = new List<Size>();
        public ICollection<Image> Images { get; set; } = new List<Image>();
        public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public ICollection<Discount> Discounts { get; set; } = new List<Discount>();
    }
}