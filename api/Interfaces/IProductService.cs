using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Product;

namespace api.Services
{
    public interface IProductService
    {
        Task<List<ProductDTO>> GetAllProductsAsync();
        Task<ProductDTO> GetProductByIdAsync(Guid id);
        Task<List<ProductDTO>> GetProductsByCategoryAsync(Guid cateId);
        Task<ProductDTO> CreateProductAsync(ProductDTO ProductDTO);
        Task<bool> UpdateProductAsync(ProductDTO productDto);
        Task<bool> DeleteProductAsync(Guid id);
    }
}