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
        private readonly ILogger<ProductService> _logger;

        public ProductService(
            ApplicationDbContext context,
            ILogger<ProductService> logger
        )
        {
            _context = context;
            _logger = logger;
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
                RowVersion = p.RowVersion,
                Colors = p.Colors.Select(c => new ColorDTO
                {
                    // Id = c.Id,
                    Name = c.Name,
                    ColorCode = c.ColorCode
                }).ToList(),
                Sizes = p.Sizes.Select(s => new SizeDTO
                {
                    // Id = s.Id,
                    Name = s.Name
                }).ToList(),
                Images = p.Images.Select(i => new ImageDTO
                {
                    // Id = i.Id,
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
                Status = product.Status,
                RowVersion = product.RowVersion,
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
            // Validate input
            if (productDto == null)
                throw new ArgumentNullException(nameof(productDto), "Product data is required.");

            // Map ProductDTO to Product entity
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                StockQuantity = productDto.StockQuantity,
                CategoryId = productDto.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = productDto.Status
            };

            // Handle related collections (e.g., Colors, Sizes, etc.)
            if (productDto.Colors != null && productDto.Colors.Any())
            {
                product.Colors = productDto.Colors.Select(c => new Color
                {
                    // Id = Guid.NewGuid(),
                    Name = c.Name,
                    ColorCode = c.ColorCode
                }).ToList();
            }

            if (productDto.Sizes != null && productDto.Sizes.Any())
            {
                product.Sizes = productDto.Sizes.Select(s => new Size
                {
                    // Id = Guid.NewGuid(),
                    Name = s.Name
                }).ToList();
            }

            if (productDto.Images != null && productDto.Images.Any())
            {
                product.Images = productDto.Images.Select(i => new Image
                {
                    // Id = Guid.NewGuid(),
                    Url = i.Url,
                    AltText = i.AltText
                }).ToList();
            }

            // Add product to the database
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Map saved product back to ProductDTO
            productDto.Id = product.Id;
            productDto.CreatedAt = product.CreatedAt;
            productDto.UpdatedAt = product.UpdatedAt;

            return productDto;
        }


        public async Task<ProductDTO> UpdateProductAsync(ProductDTO productDto)
        {
            if (productDto == null)
                throw new ArgumentNullException(nameof(productDto), "Product data is required.");

            const int maxRetries = 3; // Max number of retries
            int attempt = 0;
            bool success = false;

            while (attempt < maxRetries && !success)
            {
                try
                {
                    // Fetch the product from the database based on the ID, including RowVersion for concurrency control
                    var product = await _context.Products
                        .Include(p => p.Colors)  // Including related colors
                        .Include(p => p.Sizes)   // Including related sizes
                        .Include(p => p.Images)  // Including related images
                        .FirstOrDefaultAsync(p => p.Id == productDto.Id);

                    _logger.LogInformation($"Updating product with ID {productDto.Id}");
                    _logger.LogInformation($"Row Version Product: {BitConverter.ToString(product.RowVersion)}");
                    _logger.LogInformation($"Row Version Product DTO: {BitConverter.ToString(productDto.RowVersion)}");

                    if (product == null)
                        throw new KeyNotFoundException($"Product with ID {productDto.Id} not found.");

                    // Compare the RowVersion from the database with the one sent by the client
                    if (!product.RowVersion.SequenceEqual(productDto.RowVersion))
                    {
                        // If RowVersion doesn't match, throw concurrency exception
                        throw new DbUpdateConcurrencyException("The product has been modified by another user.");
                    }


                    _logger.LogInformation("Updating product properties...");


                    // Update product properties
                    product.Name = productDto.Name;
                    product.Description = productDto.Description;
                    product.Price = productDto.Price;
                    product.StockQuantity = productDto.StockQuantity;
                    product.CategoryId = productDto.CategoryId;
                    product.Status = productDto.Status;
                    product.UpdatedAt = DateTime.UtcNow;

                    // Update Colors (assuming ColorDTO contains color details)
                    UpdateProductColors(product, productDto.Colors);

                    // Update Sizes (assuming SizeDTO contains size details)
                    UpdateProductSizes(product, productDto.Sizes);

                    // Update Images (assuming ImageDTO contains image URLs or paths)
                    UpdateProductImages(product, productDto.Images);

                    // Save changes to the database, this will automatically check the RowVersion
                    await _context.SaveChangesAsync();

                    success = true; // If no error, mark as successful

                    // Return the updated DTO (include the new RowVersion from the DB)
                    productDto.RowVersion = product.RowVersion; // Update RowVersion in DTO
                    return productDto;

                }
                catch (DbUpdateConcurrencyException ex)
                {
                    attempt++;

                    // Log the exception for debugging
                    _logger.LogError($"Attempt {attempt} failed: Concurrency error while updating product. Retrying...");

                    if (attempt >= maxRetries)
                    {
                        // After max retries, throw an exception
                        throw new Exception("The product was updated or deleted by another process. Please try again later.");
                    }

                    // Wait before retrying (could be adjusted based on needs)
                    await Task.Delay(1000); // 1 second delay before retry
                }
            }

            return productDto; // This line is not reached unless retry is successful
        }



        // Method to update the product colors
        private void UpdateProductColors(Product product, List<ColorDTO> colors)
        {
            // Remove all existing colors
            product.Colors.Clear();

            // Add the new colors
            foreach (var color in colors)
            {
                var productColor = new Color
                {
                    Name = color.Name,
                    ColorCode = color.ColorCode // Assuming color code is part of the DTO
                };
                product.Colors.Add(productColor);
            }
        }

        // Method to update the product sizes
        private void UpdateProductSizes(Product product, List<SizeDTO> sizes)
        {
            // Remove all existing sizes
            product.Sizes.Clear();

            // Add the new sizes
            foreach (var size in sizes)
            {
                var productSize = new Size
                {
                    Name = size.Name
                };
                product.Sizes.Add(productSize);
            }
        }

        // Method to update the product images
        private void UpdateProductImages(Product product, List<ImageDTO> images)
        {
            // Remove all existing images
            product.Images.Clear();

            // Add the new images
            foreach (var image in images)
            {
                var productImage = new Image
                {
                    Url = image.Url,
                    AltText = image.AltText // Assuming alt text is part of the DTO
                };
                product.Images.Add(productImage);
            }
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

        public async Task<List<ProductDTO>> GetProductsByCategoryAsync(Guid cateId)
        {
            try
            {
                // Get the products for the given categoryId
                var products = await _context.Products
                    .Where(p => p.CategoryId == cateId) // Filter by category
                    .Include(p => p.Colors) // Include related Colors
                    .Include(p => p.Sizes) // Include related Sizes
                    .Include(p => p.Images) // Include related Images
                    .Include(p => p.Discounts) // Include related Discounts
                    .Include(p => p.Feedbacks) // Include related Feedbacks
                    .ToListAsync();

                // Map the products to ProductDTO
                var productDtos = products.Select(product => new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    StockQuantity = product.StockQuantity,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt,
                    CategoryId = product.CategoryId,
                    Status = product.Status,
                    // Mapping the related collections
                    Colors = product.Colors.Select(c => new ColorDTO
                    {
                        // Assuming ColorDTO has relevant properties
                        Id = c.Id,
                        Name = c.Name,
                        ColorCode = c.ColorCode
                    }).ToList(),
                    Sizes = product.Sizes.Select(s => new SizeDTO
                    {
                        // Assuming SizeDTO has relevant properties
                        Id = s.Id,
                        Name = s.Name
                    }).ToList(),
                    Images = product.Images.Select(i => new ImageDTO
                    {
                        // Assuming ImageDTO has relevant properties
                        Id = i.Id,
                        Url = i.Url,
                        AltText = i.AltText
                    }).ToList(),
                    Discounts = product.Discounts.Select(d => new DiscountDto
                    {
                        // Assuming DiscountDto has relevant properties
                        Id = d.Id,
                        Percentage = d.Percentage,
                        Name = d.Name,
                        StartDate = d.StartDate,
                        EndDate = d.EndDate

                    }).ToList(),
                    Feedbacks = product.Feedbacks.Select(f => new FeedbackDTO
                    {
                        // Assuming FeedbackDTO has relevant properties
                        Id = f.Id,
                        Comment = f.Comment,
                        Rating = f.Rating
                    }).ToList()
                }).ToList();

                return productDtos;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error while retrieving products by category.");
                // Handle the error appropriately, possibly return an empty list or a specific error response
                return new List<ProductDTO>();
            }
        }

    }
}