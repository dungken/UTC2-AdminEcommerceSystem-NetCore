# Working with SQL Server on Docker

## Introduction

This guide provides instructions on how to run SQL Server in a Docker container and connect to it for development purposes. This setup allows for easy management and isolation of the database environment.

## Prerequisites

-  **Docker Desktop**: Ensure that you have Docker Desktop installed on your machine. You can download it from the [official Docker website](https://www.docker.com/products/docker-desktop).
-  **SQL Server Management Studio (SSMS)** or **Azure Data Studio**: Recommended tools for managing SQL Server databases.

## Setting Up SQL Server with Docker

### Step 1: Pull the SQL Server Docker Image

Open your terminal (Command Prompt, PowerShell, or Terminal) and run the following command to pull the SQL Server image:

```bash
docker pull mcr.microsoft.com/mssql/server
```

### Step 2: Run the SQL Server Container

Run the following command to start a new SQL Server container:

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Passw0rd" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server
```

Replace `YourStrong!Passw0rd` with a strong password of your choice.

### Step 3: Verify the SQL Server Container

To verify that the SQL Server container is running, use the following command:

```bash
docker ps
```

You should see the SQL Server container listed in the output.

### Step 4: Connect to SQL Server

You can now connect to the SQL Server instance using SQL Server Management Studio (SSMS) or Azure Data Studio. Use `localhost` as the server name and the `SA` account with the password you specified.

## Conclusion

You have successfully set up SQL Server in a Docker container. You can now use this environment for development and testing purposes.
