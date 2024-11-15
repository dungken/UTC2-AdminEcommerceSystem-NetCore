using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Category;

namespace api.Services
{
    public interface ICategoryService
    {
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto categoryDto);
        Task<CategoryDto> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        Task<IEnumerable<CategoryDto>> GetSubCategoriesAsync(Guid parentCategoryId);
        Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDto categoryDto);
        Task<bool> DeleteCategoryAsync(Guid categoryId);
    }
}