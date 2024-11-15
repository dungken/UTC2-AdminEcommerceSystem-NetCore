using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Product;

namespace api.Services
{
    public interface IImageService
    {
        Task<ImageDTO> UploadImageAsync(IFormFile file, Guid productId, string altText);
        Task<IEnumerable<ImageDTO>> UploadImagesAsync(IFormFile[] files, Guid productId, string altText);
        Task<ImageDTO> UpdateImageAsync(Guid imageId, IFormFile file, string altText);
        Task<IEnumerable<ImageDTO>> UpdateImagesAsync(Guid productId, IFormFile[] newFiles, IEnumerable<Guid> imageIdsToDelete, string altText);
        Task<ImageDTO> GetImageByIdAsync(Guid imageId);
        Task<IEnumerable<ImageDTO>> GetImagesByProductIdAsync(Guid productId);
        Task DeleteImageAsync(Guid imageId);
    }
}