# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project files and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the application files and build the app
COPY . .
RUN dotnet publish -c Release -o /app/out

# Stage 2: Run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Set environment variables for SQL Server connection
ENV ASPNETCORE_URLS=http://+:80
ENV ConnectionStrings__DefaultConnection="Server=LAPTOP-5E9E2LGL\SQLEXPRESS;Database=MyDatabase;User=sa;Password=Password123;"

# Expose port 80
EXPOSE 80

# Run the application
ENTRYPOINT ["dotnet", "api.dll"]
