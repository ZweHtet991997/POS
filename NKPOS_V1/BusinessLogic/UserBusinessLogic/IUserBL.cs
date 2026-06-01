namespace NKPOS_V1.BusinessLogic.UserBusinessLogic
{
    public interface IUserBL
    {
        Task<ApiResponseModel> RegisterUserAsync(UserModel model);
        Task<UserListResponseModel> GetUserListAsync();
        Task<LoginResponseModel> Login(LoginRequestModel model);
    }
}
