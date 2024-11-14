using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Reponse;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace api.Services
{
    public interface IBaseReponseService
    {
        BaseResponse<T> CreateSuccessResponse<T>(T data, string message = "Request successful.");
        BaseResponse<T> CreateErrorResponse<T>(string message, List<string> errors = null);
        BaseResponse<object> CreateModelStateErrorResponse(string message, ModelStateDictionary modelState);
        BaseResponse<object> CreateModelStateErrorResponse(string message, IEnumerable<IdentityError> errors);
    }
}