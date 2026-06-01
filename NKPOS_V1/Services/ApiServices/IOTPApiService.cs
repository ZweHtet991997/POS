namespace NKPOS_V1.Services.ApiServices
{
    public interface IOTPApiService
    {
        Task<BaseResponseModel> RequestOTPAndSendMail(MailRequestModel model);
        Task<BaseResponseModel> ValidateOTP(string email, int code);
    }
}