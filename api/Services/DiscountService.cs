using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Discount;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DiscountService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto discountDto)
        {
            var discount = _mapper.Map<Discount>(discountDto);
            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();
            return _mapper.Map<DiscountDto>(discount);
        }

        public async Task<DiscountDto> GetDiscountByIdAsync(Guid id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
                return null;
            return _mapper.Map<DiscountDto>(discount);
        }

        public async Task<IEnumerable<DiscountDto>> GetAllDiscountsAsync()
        {
            var discounts = await _context.Discounts.ToListAsync();
            return _mapper.Map<IEnumerable<DiscountDto>>(discounts);
        }

        public async Task<DiscountDto> UpdateDiscountAsync(Guid id, CreateDiscountDto discountDto)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
                return null;

            _mapper.Map(discountDto, discount);
            await _context.SaveChangesAsync();
            return _mapper.Map<DiscountDto>(discount);
        }

        public async Task<bool> DeleteDiscountAsync(Guid id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
                return false;

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}