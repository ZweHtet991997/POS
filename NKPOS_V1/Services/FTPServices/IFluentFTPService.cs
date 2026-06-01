namespace NKPOS_V1.Services.FTPServices
{
    public interface IFluentFTPService
    {
        Task<bool> CheckDirectoryExistAsync(string directoryName);
        Task<bool> CreateDirectoryAsync(string directoryName);
        Task<EnumFTPResponse> DeleteFileAsync(string filePath, bool isFileDelete);
        Task<FTPResponseModel> FTPFileUploadAsync_V1(FTPModel model);
        Task UploadFileAsync(IFormFile file, string directoryName, string fileName);
    }
}