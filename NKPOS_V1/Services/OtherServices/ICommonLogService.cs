namespace NKPOS_V1.Services.OtherServices
{
    public interface ICommonLogService
    {
        void LogError(Exception ex, string message, string userName, string targetMethod);
        void LogInfo(string message, string userName, string targetMethod, string payload);
    }
}