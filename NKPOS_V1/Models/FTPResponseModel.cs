namespace NKPOS_V1.Models
{
    public class FTPConfigModel
    {
        public string Host { get; set; } = null!;
        public string UserName { get; set; } = null;
        public string Password { get; set; } = null;
    }

    public class FTPModel
    {
        public string DirectoryName { get; set; } = null!;
        public IFormFile File { get; set; }
        public FTPConfigModel FTPConfig { get; set; } = null!;
    }

    public class FTPResponseModel
    {
        public string FileName { get; set; }
        public string Message { get; set; } = null!;
    }

    public class FTPDeleteRequestModel
    {
        public string FilePath { get; set; }
    }

    public class FileServiceResponseModel
    {
        public string Filepath { get; set; }
        public ApiResponseModel responseModel { get; set; } = new ApiResponseModel();
    }
}
