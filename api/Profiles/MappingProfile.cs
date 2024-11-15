using System.Data;
using api.Dtos.Discount;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateDiscountDto, Discount>();
            CreateMap<Discount, DiscountDto>();
        }
    }
}