using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDataModel_ModuleUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions");

            // Drop the index
            migrationBuilder.DropIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions");

            // Drop the primary key constraint on RolePermissions
            migrationBuilder.DropPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions");

            // Drop the primary key constraint on Permissions
            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            // Drop the existing column in RolePermissions
            migrationBuilder.DropColumn(
                name: "PermissionId",
                table: "RolePermissions");

            // Drop the existing column in Permissions
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Permissions");

            // Recreate the column with the new type in Permissions
            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Permissions",
                type: "nvarchar(450)",
                nullable: false);

            // Recreate the column with the new type in RolePermissions
            migrationBuilder.AddColumn<string>(
                name: "PermissionId",
                table: "RolePermissions",
                type: "nvarchar(450)",
                nullable: false);

            // Recreate the primary key constraint on Permissions
            migrationBuilder.AddPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            // Recreate the primary key constraint on RolePermissions
            migrationBuilder.AddPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions",
                columns: new[] { "RoleId", "PermissionId" });

            // Recreate the index
            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            // Recreate the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions");

            // Drop the index
            migrationBuilder.DropIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions");

            // Drop the primary key constraint on RolePermissions
            migrationBuilder.DropPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions");

            // Drop the primary key constraint on Permissions
            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            // Drop the recreated column in RolePermissions
            migrationBuilder.DropColumn(
                name: "PermissionId",
                table: "RolePermissions");

            // Drop the recreated column in Permissions
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Permissions");

            // Recreate the original column with the old type in Permissions
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Permissions",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            // Recreate the original column with the old type in RolePermissions
            migrationBuilder.AddColumn<int>(
                name: "PermissionId",
                table: "RolePermissions",
                type: "int",
                nullable: false);

            // Recreate the primary key constraint on Permissions
            migrationBuilder.AddPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            // Recreate the primary key constraint on RolePermissions
            migrationBuilder.AddPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions",
                columns: new[] { "RoleId", "PermissionId" });

            // Recreate the index
            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            // Recreate the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
