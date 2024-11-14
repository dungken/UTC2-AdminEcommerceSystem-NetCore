using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Reponse;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace api.Services
{
    public class BaseReponseService : IBaseReponseService
    {
        public BaseResponse<T> CreateSuccessResponse<T>(T data, string message = "Request successful.")
        {
            return new BaseResponse<T>(data, message);
        }

        public BaseResponse<T> CreateErrorResponse<T>(string message, List<string> errors = null)
        {
            return new BaseResponse<T>(message, errors);
        }

        public BaseResponse<object> CreateModelStateErrorResponse(string message, ModelStateDictionary modelState)
        {
            // Extract error messages from the ModelState dictionary
            var errors = modelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            // Return a BaseResponse with the error messages
            return CreateErrorResponse<object>(message, errors);
        }

        public BaseResponse<object> CreateModelStateErrorResponse(string message, IEnumerable<IdentityError> errors)
        {
            // Extract error messages from the IdentityError list
            var errorMessages = errors.Select(e => e.Description).ToList();

            // Return a BaseResponse with the error messages
            return CreateErrorResponse<object>(message, errorMessages);
        }
    }
}