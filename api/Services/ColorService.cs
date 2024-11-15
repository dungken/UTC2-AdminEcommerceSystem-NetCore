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
    public class ColorService : IColorService
    {
        private readonly ApplicationDbContext _context;

        public ColorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ColorDTO>> GetAllColorsAsync()
        {
            var colors = await _context.Colors
                .Select(c => new ColorDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    ColorCode = c.ColorCode
                })
                .ToListAsync();

            return colors;
        }

        public async Task<ColorDTO> GetColorByIdAsync(Guid id)
        {
            var color = await _context.Colors
                .Where(c => c.Id == id)
                .Select(c => new ColorDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    ColorCode = c.ColorCode
                })
                .FirstOrDefaultAsync();

            return color;
        }

        public async Task<ColorDTO> CreateColorAsync(ColorDTO colorDto)
        {
            var color = new Color
            {
                Id = Guid.NewGuid(),
                Name = colorDto.Name,
                ColorCode = colorDto.ColorCode
            };

            _context.Colors.Add(color);
            await _context.SaveChangesAsync();

            colorDto.Id = color.Id;
            return colorDto;
        }

        public async Task<ColorDTO> UpdateColorAsync(Guid id, ColorDTO colorDto)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null)
            {
                return null;
            }

            color.Name = colorDto.Name;
            color.ColorCode = colorDto.ColorCode;

            _context.Colors.Update(color);
            await _context.SaveChangesAsync();

            return colorDto;
        }

        public async Task<bool> DeleteColorAsync(Guid id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null)
            {
                return false;
            }

            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();

            return true;
        }
    }

}