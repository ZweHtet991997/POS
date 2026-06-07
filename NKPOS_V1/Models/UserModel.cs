namespace NKPOS_V1.Models
{
    public class UserModel
    {
        public int UserId { get; set; }
        public int? Business_Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UserListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<UserResponseModel> DataLst { get; set; } = new List<UserResponseModel>();
        public int TotalUserCount { get; set; }
        public int AdminCount { get; set; }
        //public int ManagerCount { get; set; }
        public int CashierCount { get; set; }
        public int ActiveUserCount { get; set; }

    }

    public class UserResponseModel
    {
        public int UserId { get; set; }
        public int? Business_Id { get; set; }
        public string? BusinessName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }

    public class RegisterModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int Business_Id { get; set; }
    }

    public class LoginRequestModel
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();

        public string Token { get; set; } = null!;
    }
}
