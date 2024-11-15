using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Product;
using api.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class ImageService : IImageService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ImageService> _logger;

        public ImageService(Cloudinary cloudinary, ApplicationDbContext context, ILogger<ImageService> logger)
        {
            _cloudinary = cloudinary;
            _context = context;
            _logger = logger;
        }

        // Upload an image to Cloudinary and save info to the database
        public async Task<ImageDTO> UploadImageAsync(IFormFile file, Guid productId, string altText)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }

            if (!file.ContentType.StartsWith("image/"))
            {
                throw new ArgumentException("Uploaded file is not an image.");
            }

            try
            {
                // Upload the image to Cloudinary
                var uploadResult = await UploadToCloudinaryAsync(file);

                // Create the image record in the database
                var image = new Image
                {
                    Id = Guid.NewGuid(),
                    Url = uploadResult.Url.ToString(),
                    AltText = altText,
                    ProductId = productId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Save to database
                _context.Add(image);
                await _context.SaveChangesAsync();

                // Return the image details as a DTO
                return new ImageDTO
                {
                    Id = image.Id,
                    Url = image.Url,
                    AltText = image.AltText,
                    ProductId = image.ProductId,
                    CreatedAt = image.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading the image.");
                throw new Exception("Internal server error.");
            }
        }


        // Update an image
        public async Task<ImageDTO> UpdateImageAsync(Guid imageId, IFormFile file, string altText)
        {
            var image = await _context.Images.FindAsync(imageId);
            if (image == null)
            {
                throw new KeyNotFoundException("Image not found.");
            }

            try
            {
                // Upload the new image to Cloudinary if a new file is provided
                if (file != null && file.Length > 0)
                {
                    var uploadResult = await UploadToCloudinaryAsync(file);
                    image.Url = uploadResult.Url.ToString();
                }

                // Update altText if provided
                if (!string.IsNullOrEmpty(altText))
                {
                    image.AltText = altText;
                }

                // Update timestamp
                image.UpdatedAt = DateTime.UtcNow;

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Return the updated image as DTO
                return new ImageDTO
                {
                    Id = image.Id,
                    Url = image.Url,
                    AltText = image.AltText,
                    ProductId = image.ProductId,
                    CreatedAt = image.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the image.");
                throw new Exception("Internal server error.");
            }
        }


        // Get an image by ID
        public async Task<ImageDTO> GetImageByIdAsync(Guid imageId)
        {
            var image = await _context.Images.FindAsync(imageId);
            if (image == null)
            {
                throw new KeyNotFoundException("Image not found.");
            }

            return new ImageDTO
            {
                Id = image.Id,
                Url = image.Url,
                AltText = image.AltText,
                ProductId = image.ProductId,
                CreatedAt = image.CreatedAt
            };
        }


        // Get all images for a product
        public async Task<IEnumerable<ImageDTO>> GetImagesByProductIdAsync(Guid productId)
        {
            var images = await _context.Images.Where(i => i.ProductId == productId).ToListAsync();
            if (images == null || !images.Any())
            {
                throw new KeyNotFoundException("No images found for this product.");
            }

            return images.Select(image => new ImageDTO
            {
                Id = image.Id,
                Url = image.Url,
                AltText = image.AltText,
                ProductId = image.ProductId,
                CreatedAt = image.CreatedAt
            }).ToList();
        }


        // Delete an image from the database and Cloudinary
        public async Task DeleteImageAsync(Guid imageId)
        {
            var image = await _context.Images.FindAsync(imageId);
            if (image == null)
            {
                throw new KeyNotFoundException("Image not found.");
            }

            // Delete from Cloudinary
            var publicId = GetPublicIdFromUrl(image.Url); // Extract the public ID from the URL
            await DeleteImageFromCloudinary(publicId);

            // Delete the image from the database
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
        }



        // Helper method to extract the public ID from Cloudinary URL
        private string GetPublicIdFromUrl(string url)
        {
            // Extract the public ID from the Cloudinary URL
            var uri = new Uri(url);
            var segments = uri.AbsolutePath.Split('/');
            return segments[segments.Length - 1].Split('.')[0]; // The last part before the file extension is the public ID
        }

        // Helper method to delete image from Cloudinary
        private async Task DeleteImageFromCloudinary(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deletionParams);
            if (result.Result != "ok")
            {
                _logger.LogWarning($"Failed to delete image with public ID: {publicId}");
            }
        }

        // Upload multiple images to Cloudinary and save the info to the database
        public async Task<IEnumerable<ImageDTO>> UploadImagesAsync(IFormFile[] files, Guid productId, string altText)
        {
            if (files == null || files.Length == 0)
            {
                throw new ArgumentException("No files uploaded.");
            }

            List<ImageDTO> imageDTOs = new List<ImageDTO>();

            try
            {
                // Iterate through each file and upload it to Cloudinary
                foreach (var file in files)
                {
                    if (file == null || file.Length == 0)
                    {
                        continue;
                    }

                    if (!file.ContentType.StartsWith("image/"))
                    {
                        throw new ArgumentException("Uploaded file is not an image.");
                    }

                    // Upload image to Cloudinary
                    var uploadResult = await UploadToCloudinaryAsync(file);

                    // Create the image record in the database
                    var image = new Image
                    {
                        Id = Guid.NewGuid(),
                        Url = uploadResult.Url.ToString(),
                        AltText = altText,
                        ProductId = productId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    // Save to the database
                    _context.Add(image);
                    await _context.SaveChangesAsync();

                    // Add the image details to the DTO list
                    imageDTOs.Add(new ImageDTO
                    {
                        Id = image.Id,
                        Url = image.Url,
                        AltText = image.AltText,
                        ProductId = image.ProductId,
                        CreatedAt = image.CreatedAt
                    });
                }

                return imageDTOs;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading images.");
                throw new Exception("Internal server error.");
            }
        }


        // Update multiple images: replace old images and add new ones
        public async Task<IEnumerable<ImageDTO>> UpdateImagesAsync(Guid productId, IFormFile[] newFiles, IEnumerable<Guid> imageIdsToDelete, string altText)
        {
            if (newFiles == null || newFiles.Length == 0)
            {
                throw new ArgumentException("No files uploaded.");
            }

            List<ImageDTO> imageDTOs = new List<ImageDTO>();

            try
            {
                // Step 1: Delete old images from Cloudinary and database
                var imagesToDelete = _context.Images.Where(x => imageIdsToDelete.Contains(x.Id)).ToList();
                foreach (var image in imagesToDelete)
                {
                    // Delete from Cloudinary
                    var publicId = GetPublicIdFromUrl(image.Url); // Extract the public ID from the URL
                    await DeleteImageFromCloudinary(publicId);

                    // Remove from database
                    _context.Images.Remove(image);
                }
                await _context.SaveChangesAsync();

                // Step 2: Upload new images to Cloudinary
                foreach (var file in newFiles)
                {
                    if (file == null || file.Length == 0)
                    {
                        continue;
                    }

                    if (!file.ContentType.StartsWith("image/"))
                    {
                        throw new ArgumentException("Uploaded file is not an image.");
                    }

                    // Upload image to Cloudinary
                    var uploadResult = await UploadToCloudinaryAsync(file);

                    // Create the image record in the database
                    var image = new Image
                    {
                        Id = Guid.NewGuid(),
                        Url = uploadResult.Url.ToString(),
                        AltText = altText,
                        ProductId = productId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    // Save to the database
                    _context.Add(image);
                    await _context.SaveChangesAsync();

                    // Add to the DTO list
                    imageDTOs.Add(new ImageDTO
                    {
                        Id = image.Id,
                        Url = image.Url,
                        AltText = image.AltText,
                        ProductId = image.ProductId,
                        CreatedAt = image.CreatedAt
                    });
                }

                return imageDTOs;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating images.");
                throw new Exception("Internal server error.");
            }
        }



        // Helper method to upload image to Cloudinary
        private async Task<UploadResult> UploadToCloudinaryAsync(IFormFile file)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream())
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult;
        }

        // Other CRUD methods remain the same
    }

}