using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Product
{
    public class CreateFeedbackDto
    {
        public Guid ProductId { get; set; }
        public int Rating { get; set; } // Rating out of 5
        public string Comment { get; set; }
    }
}