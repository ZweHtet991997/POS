namespace NKPOS_V1.Services.FTPServices
{
    public class FluentFTPService : IFluentFTPService
    {
        private AsyncFtpClient _ftp;
        private readonly ILogger<FluentFTPService> _logger;

        public FluentFTPService(ILogger<FluentFTPService> logger)
        {
            _logger = logger;
        }

        private AsyncFtpClient SetupFTPCredentials()
        {
            _ftp = new AsyncFtpClient
            {
                Host = FTPConfig.FTP_IP,
                Credentials = new NetworkCredential(FTPConfig.FTP_UserName, FTPConfig.FTP_Password)
            };
            return _ftp;
        }

        public async Task<FTPResponseModel> FTPFileUploadAsync_V1(FTPModel model)
        {
            FTPResponseModel responseModel = new FTPResponseModel();
            try
            {
                // Initializing FTP Credentials
                SetupFTPCredentials();

                if (model.File == null || model.File.Length == 0)
                {
                    responseModel.Message = ResponseMessageUtils.InvalidFile; // or whatever you use
                    return responseModel;
                }
                var fileName = GetFileName(model.File);

                // Ensure directory exists
                if (!await CheckDirectoryExistAsync(model.DirectoryName))
                {
                    if (!await CreateDirectoryAsync(model.DirectoryName))
                    {
                        responseModel.Message = ResponseMessageUtils.FailedToCreateDirectory;
                        return responseModel;
                    }
                }

                // Upload single file
                await UploadFileAsync(model.File, model.DirectoryName, fileName);
                responseModel.FileName = fileName;
                responseModel.Message = ResponseMessageUtils.Success;
                return responseModel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in FTP File UploadService.");
                throw;
            }
        }


        //Check Directory Exist
        public async Task<bool> CheckDirectoryExistAsync(string directoryName)
        {
            try
            {
                await _ftp.Connect();
                return await _ftp.DirectoryExists(directoryName);
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error while Checking directory: {ex.InnerException}");
                throw;
            }
        }

        //Create New Directory
        public async Task<bool> CreateDirectoryAsync(string directoryName)
        {
            try
            {
                if (!_ftp.IsConnected)
                {
                    await _ftp.Connect();
                }
                return await _ftp.CreateDirectory(directoryName);
            }
            catch (Exception ex)
            {
                if (ex.InnerException is not null)
                {
                    _logger.LogInformation($"Create Directory Error: {ex.InnerException}");
                }

                _logger.LogInformation($"Create Directory Error: {ex.ToString()}");
                throw;
            }
        }

        //Upload File to Directory
        public async Task UploadFileAsync(IFormFile file, string directoryName, string fileName)
        {
            var tempFilePath = Path.GetTempFileName();
            _logger.LogInformation($"Upload File Temp File Path: {tempFilePath}");

            try
            {
                using (var stream = new FileStream(tempFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                if (!_ftp.IsConnected)
                {
                    await _ftp.Connect();
                }
                _logger.LogInformation("Connected to FTP server.");

                var remoteFilePath = Path.Combine(directoryName, fileName).Replace("\\", "/");
                _logger.LogInformation($"Remote File Path: {remoteFilePath}");

                var success = await _ftp.UploadFile(tempFilePath, remoteFilePath);
                _logger.LogInformation("File Uploaded Successfully!");
                await _ftp.Disconnect();
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Upload File Exception: {ex.Message}");
                if (ex.InnerException != null)
                {
                    _logger.LogInformation($"Upload File Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
            finally
            {
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                    _logger.LogInformation("Temporary file deleted.");
                }
            }
        }

        //Delete file from Directory
        public async Task<EnumFTPResponse> DeleteFileAsync(string filePath, bool isFileDelete)
        {
            try
            {
                //Initializing FTP Credentials
                SetupFTPCredentials();

                await _ftp.Connect();
                if (isFileDelete)
                {
                    await _ftp.DeleteFile(filePath);
                }
                else
                {
                    await _ftp.DeleteDirectory(filePath);
                }
                _logger.LogInformation("File Deleted Successfully!");
                return EnumFTPResponse.DeleteSuccess;
            }
            catch (Exception ex)
            {
                if (ex.InnerException is not null)
                {
                    _logger.LogInformation($"Delete File Exception: {ex.InnerException.Message}");
                }
                _logger.LogInformation(ex.Message);
                return EnumFTPResponse.DeleteFileFailed;
                throw;
            }
        }

        private string GetFileName(IFormFile file)
        {
            TimeZoneInfo myanmarTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Myanmar Standard Time");
            DateTime localDateTime = DateTime.Now;
            DateTime myanmarDateTime = TimeZoneInfo.ConvertTime(
                localDateTime,
                TimeZoneInfo.Local,
                myanmarTimeZone
            );
            long unixTimeMilliseconds = new DateTimeOffset(myanmarDateTime).ToUnixTimeMilliseconds();
            return $"{unixTimeMilliseconds}_" + file.FileName;
        }
    }
}
