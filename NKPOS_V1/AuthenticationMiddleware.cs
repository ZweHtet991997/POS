namespace NKPOS_V1
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AESService _aesService;
        private readonly JWTAuth _jwtAuth;

        public AuthenticationMiddleware(RequestDelegate next, AESService aesService, JWTAuth jwtAuth)
        {
            _next = next;
            _aesService = aesService;
            _jwtAuth = jwtAuth;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            BaseResponseModel responseModel = new BaseResponseModel();
            try
            {
                string authHeader = context.Request.Headers["Authorization"]!;
                string requestPath = context.Request.Path;

                if (IsBypassedRequest(context.Request.Path))
                {
                    await _next.Invoke(context);
                }
                else
                {
                    if (authHeader is not null && authHeader.StartsWith("Bearer"))
                    {
                        string[] header_and_token = authHeader.Split(' ');
                        string header = header_and_token[0];
                        string token = header_and_token[1];

                        ClaimsPrincipal principal = _jwtAuth.ValidateToken(token);

                        if (principal is not null)
                        {
                            int userId = Convert.ToInt32(principal.Claims.FirstOrDefault(x => x.Type == "UserId")!.Value);
                            string userRole = principal.Claims.FirstOrDefault(x => x.Type == "Role")!.Value;
                            string businessId = principal.Claims.FirstOrDefault(x => x.Type == "BusinessId")!.Value;
                            userRole = _aesService.Decrypt(userRole);
                            context.Items["UserId"] = userId;
                            context.Items["Role"] = userRole;
                            context.Items["BusinessId"] = businessId;

                            if (userRole == EnumUserRole.SuperAdmin.ToString())
                            {
                                await _next.Invoke(context);
                                return;
                            }
                            //Admin Endpoints access check
                            else if (userRole == EnumUserRole.Admin.ToString())
                            {
                                var adminEndpoints = AdminAccessEndpoints.AdminEndPoinstList();
                                if (!adminEndpoints.Any(endpoint => endpoint.Equals(requestPath)))
                                {
                                    responseModel.RespCode = EnumStatusCode.UnAuthorized;
                                    responseModel.RespMessage = ResponseMessageUtils.UnAuthorizeAccessEndpoint;
                                    await context.Response.WriteAsJsonAsync(responseModel);
                                    return;
                                }
                            }
                            //Casher Endpoints access check
                            else if (userRole == EnumUserRole.Casher.ToString())
                            {
                                var pmEndpoints = CasherAccessEndpoints.CasherEndPoinstList();
                                if (!pmEndpoints.Any(endpoint => endpoint.Equals(requestPath)))
                                {
                                    responseModel.RespCode = EnumStatusCode.UnAuthorized;
                                    responseModel.RespMessage = ResponseMessageUtils.UnAuthorizeAccessEndpoint;
                                    await context.Response.WriteAsJsonAsync(responseModel);
                                    return;
                                }
                            }
                            await _next.Invoke(context);
                            return;
                        }
                        responseModel.RespCode = EnumStatusCode.UnAuthorized;
                        responseModel.RespMessage = ResponseMessageUtils.UnAuthorizeAccessEndpoint;
                        await context.Response.WriteAsJsonAsync(responseModel);
                    }
                    else
                    {
                        responseModel.RespCode = EnumStatusCode.UnAuthorized;
                        responseModel.RespMessage = ResponseMessageUtils.InvalidToken;
                        await context.Response.WriteAsJsonAsync(responseModel);
                    }
                }
            }
            catch (Exception ex)
            {
                responseModel.RespCode = EnumStatusCode.InternalServerError;
                responseModel.RespMessage = ex.Message;
                await context.Response.WriteAsJsonAsync(responseModel);
            }
        }

        private bool IsBypassedRequest(string requestPath)
        {
            return requestPath == "/api/v1/login"
                || requestPath == "/api/user/validate-otp"
                || requestPath == "/api/get-token"
                || requestPath.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                || requestPath.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)
                || requestPath.EndsWith(".png", StringComparison.OrdinalIgnoreCase);
        }
    }
}
