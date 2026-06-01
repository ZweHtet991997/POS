namespace NKPOS_V1.Services.ApiServices
{
    public interface IPasswordPolicyApiService
    {
        Task<string> CheckPasswordPolicy(string password);
    }
}