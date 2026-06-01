
using Newtonsoft.Json;

namespace NKPOS_V1.BusinessLogic.UserBusinessLogic
{
    public class UserBL : IUserBL
    {
        private readonly IUserService _userService;
        private readonly AESService _aesService;
        private readonly JWTAuth _jwtAuth;
        private readonly IPasswordPolicyApiService _passwordPolicyApiService;
        private readonly IHttpContextAccessor _contextAccessor;

        public UserBL(IUserService userService, AESService aesService,
            IPasswordPolicyApiService passwordPolicyApiService, IHttpContextAccessor contextAccessor, JWTAuth jwtAuth)
        {
            _userService = userService;
            _aesService = aesService;
            _passwordPolicyApiService = passwordPolicyApiService;
            _contextAccessor = contextAccessor;
            _jwtAuth = jwtAuth;
        }

        public async Task<ApiResponseModel> RegisterUserAsync(UserModel model)
        {
            var validationResponse = ValidateRegisterUser(model);

            if (validationResponse != null)
            {
                return validationResponse;
            }

            #region Check Password Policy
            var passwordPolicyResponse = await _passwordPolicyApiService.CheckPasswordPolicy(model.Password);
            if (!string.IsNullOrEmpty(passwordPolicyResponse))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest,
                    JsonConvert.DeserializeObject<string>(passwordPolicyResponse)!);
            }
            #endregion

            #region Check Email Duplicate
            bool isEmailDuplicate = await _userService.CheckEmailDuplicate(model.Email);
            if (isEmailDuplicate)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest,
                    ResponseMessageUtils.EmailAlreadyExist(model.Email));
            }
            #endregion

            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

            return await _userService.RegisterUserAsync(model);
        }

        public async Task<UserListResponseModel> GetUserListAsync()
        {
            return await _userService.GetUserListAsync();
        }

        public async Task<LoginResponseModel> Login(LoginRequestModel model)
        {
            LoginResponseModel responseModel = new LoginResponseModel();
            if (model == null
                || string.IsNullOrWhiteSpace(model.Email)
                || string.IsNullOrWhiteSpace(model.Password))
            {
                responseModel.baseResponseModel.RespCode = EnumStatusCode.BadRequest;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.BadRequest;
                return responseModel;
            }
            User user = await _userService.Login(model);
            if (user is null)
            {
                responseModel.baseResponseModel.RespCode = EnumStatusCode.BadRequest;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.LoginFailed;
                return responseModel;
            }

            user.UserName = _aesService.EncryptString(user.UserName!);
            user.PhoneNumber = _aesService.EncryptString(user.PhoneNumber!);
            user.Email = _aesService.EncryptString(user.Email!);
            user.Role = _aesService.EncryptString(user.Role!);

            responseModel.Token = _jwtAuth.GetJWtToken(user);
            responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
            responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.LoginSuccess;
            return responseModel;

        }

        private ApiResponseModel? ValidateRegisterUser(UserModel? model)
        {
            if (model == null
                || string.IsNullOrWhiteSpace(model.UserName)
                || string.IsNullOrWhiteSpace(model.Email)
                || string.IsNullOrWhiteSpace(model.PhoneNumber)
                || string.IsNullOrWhiteSpace(model.Password)
                || model.Business_Id <= 0)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}
