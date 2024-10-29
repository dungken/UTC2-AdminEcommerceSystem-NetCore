namespace api.Models
{
    public class RolePermission
    {
        public string RoleId { get; set; }
        public AppRole Role { get; set; }

        public string PermissionId { get; set; }
        public Permission Permission { get; set; }
    }
}