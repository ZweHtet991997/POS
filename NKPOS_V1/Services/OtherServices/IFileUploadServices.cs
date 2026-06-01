namespace NKPOS_V1.Services.OtherServices
{
    public interface IFileUploadServices
    {
        Task<ApiResponseModel> DeleteFile(string path, bool isFileDelete);
        Task<FileServiceResponseModel> FileUpload(IFormFile file, int productId, string businessName);
    }
}