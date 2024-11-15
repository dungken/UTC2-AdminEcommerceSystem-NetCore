using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Discount;
using api.Dtos.Product;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all products
        public async Task<List<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Colors)
                .Include(p => p.Sizes)
                .Include(p => p.Images)
                .Include(p => p.Feedbacks)
                .Include(p => p.Discounts)
                .ToListAsync();

            return products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                CategoryId = p.Category.Id,
                Colors = p.Colors.Select(c => new ColorDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    ColorCode = c.ColorCode
                }).ToList(),
                Sizes = p.Sizes.Select(s => new SizeDTO
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToList(),
                Images = p.Images.Select(i => new ImageDTO
                {
                    Id = i.Id,
                    Url = i.Url,
                    AltText = i.AltText
                }).ToList(),
                Feedbacks = p.Feedbacks.Select(f => new FeedbackDTO
                {
                    Id = f.Id,
                    Comment = f.Comment,
                    Rating = f.Rating
                }).ToList(),
                Discounts = p.Discounts.Select(d => new DiscountDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Percentage = d.Percentage
                }).ToList()
            }).ToList();
        }

        // Get product by ID
        public async Task<ProductDTO> GetProductByIdAsync(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Colors)
                .Include(p => p.Sizes)
                .Include(p => p.Images)
                .Include(p => p.Feedbacks)
                .Include(p => p.Discounts)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return null;
            }

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryId = product.Category.Id,
                Colors = product.Colors.Select(c => new ColorDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    ColorCode = c.ColorCode
                }).ToList(),
                Sizes = product.Sizes.Select(s => new SizeDTO
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToList(),
                Images = product.Images.Select(i => new ImageDTO
                {
                    Id = i.Id,
                    Url = i.Url,
                    AltText = i.AltText
                }).ToList(),
                Feedbacks = product.Feedbacks.Select(f => new FeedbackDTO
                {
                    Id = f.Id,
                    Comment = f.Comment,
                    Rating = f.Rating
                }).ToList(),
                Discounts = product.Discounts.Select(d => new DiscountDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Percentage = d.Percentage
                }).ToList()
            };
        }

        // Create product
        public async Task<ProductDTO> CreateProductAsync(ProductDTO productDto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                StockQuantity = productDto.StockQuantity,
                CategoryId = productDto.CategoryId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return productDto; // You could return a DTO with newly created product details
        }

        // Update product
        public async Task<bool> UpdateProductAsync(ProductDTO productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if (product == null)
            {
                return false;
            }

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.StockQuantity = productDto.StockQuantity;
            product.CategoryId = productDto.CategoryId;
            product.UpdatedAt = DateTime.Now;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return true;
        }

        // Delete product
        public async Task<bool> DeleteProductAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}