namespace NKPOS_V1.BusinessLogic.UserBusinessLogic
{
    public interface IUserBL
    {
        Task<ApiResponseModel> DeleteUser(int userId);
        Task<UserListResponseModel> GetUserListAsync();
        Task<ApiResponseModel> InActiveUser(int userId, bool status);
        Task<LoginResponseModel> Login(LoginRequestModel model);
        Task<ApiResponseModel> RegisterUserAsync(UserModel model);
        Task<ApiResponseModel> UpdateUser(UserModel model);
    }
}