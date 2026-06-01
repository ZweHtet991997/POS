namespace NKPOS_V1.Services.DbServices.UserServices
{
    public interface IUserService
    {
        Task<UserListResponseModel> GetUserListAsync();
        Task<User> Login(LoginRequestModel model);
        Task<ApiResponseModel> RegisterUserAsync(UserModel model);
        Task<bool> CheckEmailDuplicate(string email);
    }
}