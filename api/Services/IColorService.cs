using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Product;

namespace api.Services
{
    public interface IColorService
    {
        Task<List<ColorDTO>> GetAllColorsAsync();
        Task<ColorDTO> GetColorByIdAsync(Guid id);
        Task<ColorDTO> CreateColorAsync(ColorDTO colorDto);
        Task<ColorDTO> UpdateColorAsync(Guid id, ColorDTO colorDto);
        Task<bool> DeleteColorAsync(Guid id);
    }
}