using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CMS_Caborca_API.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Usuarios_Administradores",
                columns: new[] { "Id", "PasswordHash", "Rol", "Token_Ultima_Sesion", "Usuario" },
                values: new object[,]
                {
                    { 1, "adminCaborc@01", "SuperAdmin", null, "admin" },
                    { 2, "editorCaborc@01", "Editor", null, "editor" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Usuarios_Administradores",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios_Administradores",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
