namespace api.Models
{
    public class Permission
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}