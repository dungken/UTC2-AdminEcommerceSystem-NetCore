using Microsoft.EntityFrameworkCore;

namespace MyApp.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        // Define your DbSets (tables) here, for example:
        public DbSet<Product> Products { get; set; } // Example entity
        public DbSet<Order> Orders { get; set; }     // Another example entity


    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
    }
}
