using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Category;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create Category
        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                ParentCategoryId = categoryDto.ParentCategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId,
                SubCategories = new List<CategoryDto>() // Initialize to empty list
            };
        }

        // Get Category by Id
        public async Task<CategoryDto> GetCategoryByIdAsync(Guid categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null) return null;

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId,
                SubCategories = category.SubCategories.Select(sub => new CategoryDto
                {
                    Id = sub.Id,
                    Name = sub.Name,
                    Description = sub.Description,
                    ParentCategoryId = sub.ParentCategoryId,
                    SubCategories = new List<CategoryDto>() // Initialize to empty list
                }).ToList()
            };
        }

        // Get All Categories
        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories
                .Include(c => c.SubCategories)
                .ToListAsync();

            return categories.Select(category => new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId,
                SubCategories = category.SubCategories.Select(sub => new CategoryDto
                {
                    Id = sub.Id,
                    Name = sub.Name,
                    Description = sub.Description,
                    ParentCategoryId = sub.ParentCategoryId,
                    SubCategories = new List<CategoryDto>() // Initialize to empty list
                }).ToList()
            }).ToList();
        }

        // Get SubCategories by Parent Id
        public async Task<IEnumerable<CategoryDto>> GetSubCategoriesAsync(Guid parentCategoryId)
        {
            var subCategories = await _context.Categories
                .Where(c => c.ParentCategoryId == parentCategoryId)
                .ToListAsync();

            return subCategories.Select(subCategory => new CategoryDto
            {
                Id = subCategory.Id,
                Name = subCategory.Name,
                Description = subCategory.Description,
                ParentCategoryId = subCategory.ParentCategoryId,
                SubCategories = new List<CategoryDto>() // Initialize to empty list
            }).ToList();
        }

        // Update Category
        public async Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDto categoryDto)
        {
            var existingCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (existingCategory == null) return null;

            existingCategory.Name = categoryDto.Name;
            existingCategory.Description = categoryDto.Description;
            existingCategory.ParentCategoryId = categoryDto.ParentCategoryId;
            existingCategory.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = existingCategory.Id,
                Name = existingCategory.Name,
                Description = existingCategory.Description,
                ParentCategoryId = existingCategory.ParentCategoryId,
                SubCategories = new List<CategoryDto>() // Initialize to empty list
            };
        }

        // Delete Category
        public async Task<bool> DeleteCategoryAsync(Guid categoryId)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null)
                return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}