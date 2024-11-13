using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

namespace api.Services
{
    public class FirebaseAdminService
    {
        public FirebaseAdminService(IConfiguration configuration)
        {
            var serviceAccountKeyPath = configuration["Firebase:ServiceAccountKeyPath"];
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(serviceAccountKeyPath)
            });
        }
    }
}