using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Discount;

namespace api.Services
{
    public interface IDiscountService
    {
        Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto discountDto);
        Task<DiscountDto> GetDiscountByIdAsync(Guid id);
        Task<IEnumerable<DiscountDto>> GetAllDiscountsAsync();
        Task<DiscountDto> UpdateDiscountAsync(Guid id, CreateDiscountDto discountDto);
        Task<bool> DeleteDiscountAsync(Guid id);
    }
}