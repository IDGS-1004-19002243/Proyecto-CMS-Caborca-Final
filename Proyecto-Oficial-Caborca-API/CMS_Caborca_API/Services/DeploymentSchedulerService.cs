using CMS_Caborca_API.Data;
using Microsoft.EntityFrameworkCore;

namespace CMS_Caborca_API.Services
{
    /// <summary>
    /// Servicio en segundo plano (Worker Service) encargado de monitorear y ejecutar despliegues programados.
    /// Revisa periódicamente si existe una fecha de despliegue activa y transfiere el contenido de borrador a producción.
    /// </summary>
    public class DeploymentSchedulerService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<DeploymentSchedulerService> _logger;

        public DeploymentSchedulerService(IServiceProvider services, ILogger<DeploymentSchedulerService> logger)
        {
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BackgroundService: Monitor de Despliegue Programado iniciado.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _services.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<CaborcaContext>();

                        // Consultar si existe una programación activa en la base de datos
                        var config = await context.Configuraciones_Del_Sistema
                            .FirstOrDefaultAsync(c => c.Clave_Configuracion == "Deploy_Schedule", stoppingToken);

                        if (config != null && !string.IsNullOrEmpty(config.Valor_Configuracion))
                        {
                            if (DateTime.TryParse(config.Valor_Configuracion, out DateTime scheduleTime))
                            {
                                // Ejecutar acción si la hora actual superó la hora programada
                                if (DateTime.Now >= scheduleTime)
                                {
                                    _logger.LogInformation("Iniciando publicación automática delegada. Hora programada: {Time}", scheduleTime);

                                    var records = await context.Contenidos_Paginas.ToListAsync(stoppingToken);

                                    foreach (var record in records)
                                    {
                                        // Transferencia de stage a producción para todos los registros de contenido
                                        if (!string.IsNullOrEmpty(record.Contenido_Borrador_Stage))
                                        {
                                            record.Contenido_Publicado_Produccion = record.Contenido_Borrador_Stage;
                                        }
                                    }

                                    // Resetear la programación tras una ejecución exitosa
                                    config.Valor_Configuracion = "";
                                    
                                    await context.SaveChangesAsync(stoppingToken);

                                    _logger.LogInformation("Proceso de despliegue automático finalizado exitosamente.");
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Falla crítica en el bucle de ejecución de DeploymentSchedulerService.");
                }

                try
                {
                    // Intervalo de verificación: cada 30 segundos
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    // Manejo de salida controlada cuando el host se detiene
                    break;
                }
            }
        }
    }
}
