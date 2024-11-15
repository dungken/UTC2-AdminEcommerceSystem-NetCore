using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Product;

namespace api.Services
{
    public interface IFeedbackService
    {
        Task<FeedbackDTO> CreateFeedbackAsync(CreateFeedbackDto dto, Guid userId);
        Task<FeedbackDTO> UpdateFeedbackAsync(Guid feedbackId, UpdateFeedbackDto dto);
        Task<bool> DeleteFeedbackAsync(Guid feedbackId);
        Task<FeedbackDTO> GetFeedbackByIdAsync(Guid feedbackId);
        Task<IEnumerable<FeedbackDTO>> GetFeedbacksForProductAsync(Guid productId);
    }
}