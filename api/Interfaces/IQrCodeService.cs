namespace api.Interfaces
{
    public interface IQrCodeService
    {
        string GenerateQrCodeUri(string email, string token);
        byte[] GenerateQrCodeImage(string qrCodeUri);
        string DecodeQrCodeImage(byte[] qrCodeImage);
        Task SendTwoFactorSetupEmail(string email, string qrCodeUri);
        public string GenerateBase32Secret(int length = 16);
    }
}