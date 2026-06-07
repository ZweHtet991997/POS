namespace NKPOS_V1.Services.DbServices.UserServices
{
    public interface IUserService
    {
        Task<bool> CheckEmailDuplicate(string email);
        Task<ApiResponseModel> DeleteUser(int userId);
        Task<UserListResponseModel> GetUserListAsync();
        Task<ApiResponseModel> InActiveUser(int userId, bool status);
        Task<User> Login(LoginRequestModel model);
        Task<ApiResponseModel> RegisterUserAsync(UserModel model);
        Task<ApiResponseModel> UpdateUser(UserModel model);
    }
}