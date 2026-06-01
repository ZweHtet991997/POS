
namespace NKPOS_V1.Services.OtherServices
{
    public class CommonLogService : ICommonLogService
    {
        private readonly ILogger<CommonLogService> _logger;

        public CommonLogService(ILogger<CommonLogService> logger)
        {
            _logger = logger;
        }

        public void LogInfo(string message, string userName, string targetMethod, string payload)
        {
            using (LogContext.PushProperty("UserName", userName))
            using (LogContext.PushProperty("TargetMethod", targetMethod))
            using (LogContext.PushProperty("Payload", payload))
            {
                _logger.LogInformation(message);
            }
        }

        public void LogError(Exception ex, string message, string userName, string targetMethod)
        {
            using (LogContext.PushProperty("UserName", userName))
            using (LogContext.PushProperty("TargetMethod", targetMethod))
            {
                _logger.LogError(ex, message);
            }
        }
    }
}
