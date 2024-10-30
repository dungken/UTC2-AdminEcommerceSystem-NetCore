namespace api.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordResetEmail(string email, string callbackUrl);
        Task SendEmailAsync(string email, string subject, string message);
    }
}