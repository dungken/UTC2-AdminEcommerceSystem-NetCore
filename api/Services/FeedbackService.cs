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
    public class FeedbackService : IFeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create feedback
        public async Task<FeedbackDTO> CreateFeedbackAsync(CreateFeedbackDto dto, Guid userId)
        {
            var feedback = new Feedback
            {
                Id = Guid.NewGuid(),
                ProductId = dto.ProductId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return new FeedbackDTO
            {
                Id = feedback.Id,
                ProductId = feedback.ProductId,
                UserId = feedback.UserId,
                Rating = feedback.Rating,
                Comment = feedback.Comment,
                CreatedAt = feedback.CreatedAt,
                UpdatedAt = feedback.UpdatedAt,
                UserFullName = await _context.Users
                    .Where(u => u.Id == feedback.UserId)
                    .Select(u => u.FirstName + " " + u.LastName)
                    .FirstOrDefaultAsync()
            };
        }

        // Update feedback
        public async Task<FeedbackDTO> UpdateFeedbackAsync(Guid feedbackId, UpdateFeedbackDto dto)
        {
            var feedback = await _context.Feedbacks.FindAsync(feedbackId);
            if (feedback == null)
            {
                throw new KeyNotFoundException("Feedback not found.");
            }

            feedback.Rating = dto.Rating;
            feedback.Comment = dto.Comment;
            feedback.UpdatedAt = DateTime.UtcNow;

            _context.Feedbacks.Update(feedback);
            await _context.SaveChangesAsync();

            return new FeedbackDTO
            {
                Id = feedback.Id,
                ProductId = feedback.ProductId,
                UserId = feedback.UserId,
                Rating = feedback.Rating,
                Comment = feedback.Comment,
                CreatedAt = feedback.CreatedAt,
                UpdatedAt = feedback.UpdatedAt,
                UserFullName = await _context.Users
                    .Where(u => u.Id == feedback.UserId)
                    .Select(u => u.FirstName + " " + u.LastName)
                    .FirstOrDefaultAsync()
            };
        }

        // Delete feedback
        public async Task<bool> DeleteFeedbackAsync(Guid feedbackId)
        {
            var feedback = await _context.Feedbacks.FindAsync(feedbackId);
            if (feedback == null)
            {
                throw new KeyNotFoundException("Feedback not found.");
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();

            return true;
        }

        // Get feedback by ID
        public async Task<FeedbackDTO> GetFeedbackByIdAsync(Guid feedbackId)
        {
            var feedback = await _context.Feedbacks
                .Where(f => f.Id == feedbackId)
                .Include(f => f.User)
                .FirstOrDefaultAsync();

            if (feedback == null)
            {
                throw new KeyNotFoundException("Feedback not found.");
            }

            return new FeedbackDTO
            {
                Id = feedback.Id,
                ProductId = feedback.ProductId,
                UserId = feedback.UserId,
                Rating = feedback.Rating,
                Comment = feedback.Comment,
                CreatedAt = feedback.CreatedAt,
                UpdatedAt = feedback.UpdatedAt,
                UserFullName = feedback.User.FirstName + " " + feedback.User.LastName
            };
        }

        // Get all feedbacks for a product
        public async Task<IEnumerable<FeedbackDTO>> GetFeedbacksForProductAsync(Guid productId)
        {
            var feedbacks = await _context.Feedbacks
                .Where(f => f.ProductId == productId)
                .Include(f => f.User)
                .ToListAsync();

            return feedbacks.Select(f => new FeedbackDTO
            {
                Id = f.Id,
                ProductId = f.ProductId,
                UserId = f.UserId,
                Rating = f.Rating,
                Comment = f.Comment,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt,
                UserFullName = f.User.FirstName + " " + f.User.LastName
            }).ToList();
        }
    }
}