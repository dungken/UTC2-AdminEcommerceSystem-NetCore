using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Product;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class SizeService : ISizeService
    {
        private readonly ApplicationDbContext _context;

        public SizeService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all sizes
        public async Task<List<SizeDTO>> GetAllSizesAsync()
        {
            var sizes = await _context.Sizes
                .Select(s => new SizeDTO
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();

            return sizes;
        }

        // Get a size by its ID
        public async Task<SizeDTO> GetSizeByIdAsync(Guid id)
        {
            var size = await _context.Sizes
                .Where(s => s.Id == id)
                .Select(s => new SizeDTO
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .FirstOrDefaultAsync();

            return size;
        }

        // Create a new size
        public async Task<SizeDTO> CreateSizeAsync(SizeDTO sizeDTOSizeDTO)
        {
            var size = new Size
            {
                Id = Guid.NewGuid(),
                Name = sizeDTOSizeDTO.Name
            };

            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();

            sizeDTOSizeDTO.Id = size.Id;
            return sizeDTOSizeDTO;
        }

        // Update an existing size
        public async Task<SizeDTO> UpdateSizeAsync(Guid id, SizeDTO sizeDTOSizeDTO)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null)
            {
                return null;
            }

            size.Name = sizeDTOSizeDTO.Name;
            _context.Sizes.Update(size);
            await _context.SaveChangesAsync();

            return sizeDTOSizeDTO;
        }

        // Delete a size by its ID
        public async Task<bool> DeleteSizeAsync(Guid id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null)
            {
                return false;
            }

            _context.Sizes.Remove(size);
            await _context.SaveChangesAsync();

            return true;
        }
    }

}