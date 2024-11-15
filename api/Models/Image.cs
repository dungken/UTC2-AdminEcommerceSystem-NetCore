using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Image
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key
        public string Url { get; set; } // Image URL
        public string AltText { get; set; } // Alt text for the image
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}