# Sử dụng hình ảnh .NET SDK để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy các file dự án vào container
COPY . .

# Restore các dependency của ứng dụng
RUN dotnet restore

# Build ứng dụng và xuất kết quả ra thư mục 'out'
RUN dotnet publish -c Release -o out

# Tạo hình ảnh nhỏ hơn bằng cách dùng runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Expose cổng để container có thể được truy cập từ bên ngoài
EXPOSE 80

# Chạy ứng dụng khi container khởi động
ENTRYPOINT ["dotnet", "api.dll"]
