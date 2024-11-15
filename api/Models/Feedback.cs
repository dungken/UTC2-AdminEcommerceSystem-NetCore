using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Feedback
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key
        public string Comment { get; set; } // Feedback comment
        public int Rating { get; set; } // Rating (e.g., 1-5)
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        // Foreign Key for User
        public Guid UserId { get; set; }
        public User User { get; set; }  // Navigation property to User
    }
}