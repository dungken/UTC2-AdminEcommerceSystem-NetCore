namespace api.Dtos.Account
{
    public class ExternalLoginDto
    {
        public string Provider { get; set; }
        public string IdToken { get; set; }
    }
}