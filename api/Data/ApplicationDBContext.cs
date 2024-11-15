using System;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Remove AspNet prefix from Identity table names
            modelBuilder.Entity<User>(entity => { entity.ToTable(name: "User"); });
            modelBuilder.Entity<Role>(entity => { entity.ToTable(name: "Role"); });
            modelBuilder.Entity<UserRole>(entity => { entity.ToTable("UserRoles"); });
            modelBuilder.Entity<IdentityUserClaim<Guid>>(entity => { entity.ToTable("UserClaims"); });
            modelBuilder.Entity<IdentityUserLogin<Guid>>(entity => { entity.ToTable("UserLogins"); });
            modelBuilder.Entity<IdentityRoleClaim<Guid>>(entity => { entity.ToTable("RoleClaims"); });
            modelBuilder.Entity<IdentityUserToken<Guid>>(entity => { entity.ToTable("UserTokens"); });

            // Configure RolePermission
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => rp.RolePermissionId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            // Configure UserRole
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Set default values for CreatedAt and UpdatedAt properties
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<User>()
                .Property(u => u.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Permission>()
                .Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Permission>()
                .Property(p => p.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Role>()
                .Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Role>()
                .Property(r => r.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Soft delete configuration for User
            modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);


            // Configuration for Category
            modelBuilder.Entity<Category>()
                .HasMany(c => c.SubCategories)
                .WithOne(c => c.ParentCategory)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration for Product
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration for Color
            modelBuilder.Entity<Color>()
                .HasOne(c => c.Product)
                .WithMany(p => p.Colors)
                .HasForeignKey(c => c.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuration for Size
            modelBuilder.Entity<Size>()
                .HasOne(s => s.Product)
                .WithMany(p => p.Sizes)
                .HasForeignKey(s => s.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuration for Order
            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(od => od.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Product)
                .WithMany(p => p.OrderDetails)
                .HasForeignKey(od => od.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration for Image
            modelBuilder.Entity<Image>()
                .HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuration for Discount
            modelBuilder.Entity<Discount>()
                .HasOne(d => d.Product)
                .WithMany(p => p.Discounts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration for Payment
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuration for Feedback
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Product)
                .WithMany(p => p.Feedbacks)
                .HasForeignKey(f => f.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
