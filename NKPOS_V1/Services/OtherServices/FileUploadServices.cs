namespace NKPOS_V1.Services.OtherServices
{
    public class FileUploadServices : IFileUploadServices
    {
        private readonly IFluentFTPService _ftpService;

        public FileUploadServices(IFluentFTPService ftpService)
        {
            _ftpService = ftpService;
        }

        public async Task<FileServiceResponseModel> FileUpload(IFormFile file, int productId, string businessName)
        {
            FileServiceResponseModel fileServiceResponseModel = new FileServiceResponseModel();
            try
            {
                FTPModel ftpModel = new FTPModel();
                if (file.Length == 0)
                {
                    fileServiceResponseModel.responseModel = ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.FileRequired);
                    return fileServiceResponseModel;
                }
                ftpModel.File = file;
                ftpModel.DirectoryName = "Product/" + businessName + "/" + productId;
                var ftpResponse = await _ftpService.FTPFileUploadAsync_V1(ftpModel);

                if (ftpResponse.Message == ResponseMessageUtils.Success)
                {
                    fileServiceResponseModel.Filepath = ftpModel.DirectoryName + "/" + ftpResponse.FileName;
                    fileServiceResponseModel.responseModel = ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
                }
                return fileServiceResponseModel;
            }
            catch (Exception ex)
            {
                fileServiceResponseModel.responseModel = ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
                return fileServiceResponseModel;
            }
        }

        public async Task<ApiResponseModel> DeleteFile(string path, bool isFileDelete)
        {
            ApiResponseModel responseModel = new ApiResponseModel();
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.PathRequired);
                }
                var ftpResult = await _ftpService.DeleteFileAsync(path, true);
                if (ftpResult != EnumFTPResponse.DeleteSuccess)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ResponseMessageUtils.DeleteFileFailed);
                }
                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
