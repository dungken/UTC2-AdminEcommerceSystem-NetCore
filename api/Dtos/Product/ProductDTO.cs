using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Discount;

namespace api.Dtos.Product
{
    public class ProductDTO
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int StockQuantity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid CategoryId { get; set; }
        public string Status { get; set; }

        public List<ColorDTO> Colors { get; set; } = new List<ColorDTO>();
        public List<SizeDTO> Sizes { get; set; } = new List<SizeDTO>();
        public List<ImageDTO> Images { get; set; } = new List<ImageDTO>();
        public List<DiscountDto> Discounts { get; set; } = new List<DiscountDto>();
        public List<FeedbackDTO> Feedbacks { get; set; } = new List<FeedbackDTO>();
    }
}