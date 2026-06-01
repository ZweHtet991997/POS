namespace NKPOS_V1.Services.ApiServices
{
    public class PasswordPolicyApiService : IPasswordPolicyApiService
    {
        private RestClient _restClient;
        private AESService _aesService;

        public PasswordPolicyApiService(AESService aesService)
        {
            _aesService = aesService;
            _restClient = new RestClient(ApiUrlConfig.nonProdServiceUrl);
        }

        public async Task<string> CheckPasswordPolicy(string password)
        {
            if (password is not null)
            {
                password = _aesService.EncryptString(password);
            }
            var request = new RestRequest("/service/passwordpolicy", Method.Post);
            request.AddHeader("password", password!);

            var response = await _restClient.ExecuteAsync(request);
            return response.Content!;
        }
    }
}
