using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IUserPermissionService
    {
        Task<bool> HasPermissionAsync(string userId, string permission);
    }
}