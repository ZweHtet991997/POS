
namespace NKPOS_V1.Services.ApiServices
{
    public class OTPApiService : IOTPApiService
    {
        private RestClient _restClient;
        public OTPApiService()
        {
            _restClient = new RestClient(ApiUrlConfig.nonProdServiceUrl);
        }

        public async Task<BaseResponseModel> RequestOTPAndSendMail(MailRequestModel model)
        {
            BaseResponseModel responseModel = new BaseResponseModel();
            var request = new RestRequest("/service/email", Method.Post);
            model.Subject = "Account Vertification Code";
            model.ProjectName = "NKPOS.com";
            model.MailType = "Activate";
            request.AddJsonBody(model);

            var response = await _restClient.ExecuteAsync(request);
            if (response.IsSuccessStatusCode)
            {
                responseModel.RespCode = EnumStatusCode.Success;
                responseModel.RespMessage = ResponseMessageUtils.RequestOTPSuccess;
                return responseModel;
            }
            responseModel.RespCode = (EnumStatusCode)response.StatusCode;
            responseModel.RespMessage = response.Content!;
            return responseModel;
        }

        public async Task<BaseResponseModel> ValidateOTP(string email, int code)
        {
            BaseResponseModel responseModel = new BaseResponseModel();
            var request = new RestRequest("/service/validateotp", Method.Post);
            request.AddHeader("email", email);
            request.AddHeader("code", code);

            var response = await _restClient.ExecuteAsync(request);

            if (response.IsSuccessStatusCode)
            {
                responseModel.RespCode = EnumStatusCode.Success;
                responseModel.RespMessage = response.Content!;
                return responseModel;
            }
            responseModel.RespCode = (EnumStatusCode)response.StatusCode;
            responseModel.RespMessage = response.Content!;
            return responseModel;
        }
    }
}
