using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CMS_Caborca_API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios_Administradores",
                keyColumn: "Id",
                keyValue: 1,
                column: "Rol",
                value: "Admin");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios_Administradores",
                keyColumn: "Id",
                keyValue: 1,
                column: "Rol",
                value: "SuperAdmin");
        }
    }
}
