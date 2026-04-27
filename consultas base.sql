create database BDCaborca;

use BDCaborca;

insert into dbo.Usuarios_Administradores (Usuario, PasswordHash, Rol, Token_Ultima_Sesion) values ('superadmin', 'super123', 'superadmin', NULL);
insert into dbo.Usuarios_Administradores (Usuario, PasswordHash, Rol, Token_Ultima_Sesion) values ('admin', 'admin123', 'admin', NULL);

select * from dbo.Categorias_Productos;
select * from dbo.Configuracion_De_Correos;
select * from dbo.Configuracion_Del_Sistema;
select * from dbo.Contenidos_Paginas;
select * from dbo.Imagenes_De_Productos;
select * from dbo.Productos_Inventario;
select * from dbo.Prospectos_Recibidos;
select * from dbo.Tiendas_Y_Distribuidores
select * from dbo.Usuarios_Administradores;

/*DELETE FROM dbo.Contenidos_Paginas;*/