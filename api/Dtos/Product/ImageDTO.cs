using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Product
{
    public class ImageDTO
    {
        public Guid Id { get; set; }
        public string Url { get; set; }
        public string AltText { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid ProductId { get; set; }
    }
}