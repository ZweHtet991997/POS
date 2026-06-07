namespace NKPOS_V1.Services.DbServices.UserServices
{
    public class UserService : IUserService
    {
        private readonly EFDBContext _context;
        private readonly ICommonLogService _commonLogService;

        public UserService(EFDBContext context, ICommonLogService commonLogService)
        {
            _context = context;
            _commonLogService = commonLogService;
        }

        public async Task<ApiResponseModel> RegisterUserAsync(UserModel model)
        {
            string methodName = $"{GetType().Name}/{nameof(RegisterUserAsync)}";
            try
            {
                _commonLogService.LogInfo("Create New User", "", methodName, JsonConvert.SerializeObject(model));
                User user = new User();
                await _context.Users.AddAsync(model.ToEntity());
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                _commonLogService.LogError(ex, "Create New User", "", "UserService/RegisterUserAsync");
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<UserListResponseModel> GetUserListAsync()
        {
            try
            {
                _commonLogService.LogInfo("GetUserListAsync", "", "UserService/GetUserListAsync", null);

                var users = await (
                    from user in _context.Users.AsNoTracking()
                    join business in _context.Businesses.AsNoTracking()
                        on user.Business_Id equals business.BusinessId
                    where user.IsActive == true
                    orderby user.UserId
                    select new UserResponseModel
                    {
                        UserId = user.UserId,
                        Business_Id = user.Business_Id,
                        BusinessName = business.BusinessName,
                        UserName = user.UserName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Role = user.Role,
                        IsActive = user.IsActive
                    })
                    .ToListAsync();

                if (!users.Any())
                {
                    return new UserListResponseModel
                    {
                        baseResponseModel = new BaseResponseModel
                        {
                            RespCode = EnumStatusCode.NoData,
                            RespMessage = "No user data found."
                        },
                        DataLst = new List<UserResponseModel>(),
                        TotalUserCount = 0,
                        ActiveUserCount = 0,
                        AdminCount = 0,
                        //ManagerCount = 0,
                        CashierCount = 0
                    };
                }

                return new UserListResponseModel
                {
                    baseResponseModel = new BaseResponseModel
                    {
                        RespCode = EnumStatusCode.Success,
                        RespMessage = ResponseMessageUtils.Success
                    },
                    DataLst = users,
                    TotalUserCount = users.Count,
                    ActiveUserCount = users.Count(x => x.IsActive == true),
                    AdminCount = users.Count(x => x.Role == EnumUserRole.Admin.ToString()),
                    CashierCount = users.Count(x => x.Role == EnumUserRole.Casher.ToString())
                };
            }
            catch (Exception ex)
            {
                _commonLogService.LogError(ex, "GetUserListAsync", "", "UserService/GetUserListAsync");

                return new UserListResponseModel
                {
                    baseResponseModel = new BaseResponseModel
                    {
                        RespCode = EnumStatusCode.InternalServerError,
                        RespMessage = ex.Message
                    }
                };
            }
        }

        public async Task<User> Login(LoginRequestModel model)
        {
            try
            {
                _commonLogService.LogInfo("Login", "", "UserService/Login", JsonConvert.SerializeObject(model));
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == model.Email && x.IsActive == true);

                if (user == null) return new User();
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
                return isPasswordValid ? user : new User();
            }
            catch (Exception ex)
            {
                _commonLogService.LogError(ex, "Login", "", "UserService/Login");
                throw ex;
            }
        }

        public async Task<ApiResponseModel> UpdateUser(UserModel model)
        {
            try
            {
                var user = await _context.Users.FindAsync(model.UserId);

                if (user != null)
                {
                    _context.Users.Update(model.ToEntity(user));
                    await _context.SaveChangesAsync();
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
                }
                return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.UserNotFound);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> InActiveUser(int userId, bool status)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user != null)
                {
                    user.IsActive = status;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
                }
                return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.UserNotFound);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponseModel> DeleteUser(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user != null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
                }
                return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.UserNotFound);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> CheckEmailDuplicate(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email && u.IsActive == true);
        }
    }
}

