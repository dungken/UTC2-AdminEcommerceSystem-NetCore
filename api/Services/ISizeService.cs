using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Product;

namespace api.Services
{
    public interface ISizeService
    {
        Task<List<SizeDTO>> GetAllSizesAsync();
        Task<SizeDTO> GetSizeByIdAsync(Guid id);
        Task<SizeDTO> CreateSizeAsync(SizeDTO sizeDto);
        Task<SizeDTO> UpdateSizeAsync(Guid id, SizeDTO sizeDto);
        Task<bool> DeleteSizeAsync(Guid id);
    }
}