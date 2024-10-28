using Microsoft.EntityFrameworkCore;
using MyApp.Data; // Make sure to include the correct namespace

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add authorization services
builder.Services.AddAuthorization();

builder.Services.AddControllers(); // Ensure you have this if you're using controllers

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Other service configurations
var app = builder.Build();

// Enable middleware to serve generated Swagger as a JSON endpoint
app.UseSwagger();

// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.)
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});


// Check database connection at startup
using (var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<MyDbContext>();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();
app.Run();
