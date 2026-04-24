using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace CMS_Caborca_API.Services;

/// <summary>
/// Estructura de configuración para los parámetros del servidor de correo saliente.
/// </summary>
public class SmtpSettings
{
    public string Host { get; set; } = "smtp.office365.com";
    public int Port { get; set; } = 587;
    public string UserEmail { get; set; } = "";
    public string Password { get; set; } = "";
    public string DisplayName { get; set; } = "Caborca Boots";
}

public interface IEmailService
{
    Task SendEmailAsync(IEnumerable<string> recipients, string subject, string htmlBody);
}

/// <summary>
/// Servicio encargado de la orquestación y envío de correos electrónicos.
/// Implementa MailKit para una comunicación robusta con servidores SMTP seguros.
/// </summary>
public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtp;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _smtp = config.GetSection("Smtp").Get<SmtpSettings>() ?? new SmtpSettings();
        _logger = logger;
    }

    /// <summary>
    /// Envía un correo electrónico en formato HTML a uno o múltiples destinatarios.
    /// </summary>
    public async Task SendEmailAsync(IEnumerable<string> recipients, string subject, string htmlBody)
    {
        var recipientList = recipients.Where(r => !string.IsNullOrWhiteSpace(r)).ToList();
        if (recipientList.Count == 0)
        {
            _logger.LogWarning("Intento de envío de email abortado: Sin destinatarios definidos.");
            return;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_smtp.DisplayName, _smtp.UserEmail));
        
        foreach (var r in recipientList)
            message.To.Add(MailboxAddress.Parse(r.Trim()));
        
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        try
        {
            // Conexión segura mediante STARTTLS
            await client.ConnectAsync(_smtp.Host, _smtp.Port, SecureSocketOptions.StartTls);
            
            // Autenticación con las credenciales configuradas
            await client.AuthenticateAsync(_smtp.UserEmail, _smtp.Password);
            
            await client.SendAsync(message);
            _logger.LogInformation("Notificación enviada exitosamente a {Recipients}", string.Join(", ", recipientList));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Falla en la comunicación con el servidor SMTP ({Host})", _smtp.Host);
            throw;
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }
}
