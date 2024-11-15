using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Size
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key
        public string Name { get; set; } // Size name
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}