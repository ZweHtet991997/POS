namespace NKPOS_V1.Services.DbServices.CustomerServices
{
    public class CustomerService : ICustomerService
    {
        private readonly EFDBContext _context;

        public CustomerService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateCustomerAsync(CustomerModel model)
        {
            //string methodName = $"{GetType().Name}/{nameof(RegisterUserAsync)}";
            try
            {
                //_commonLogService.LogInfo("Create New User", "", methodName, JsonConvert.SerializeObject(model));
                User user = new User();
                await _context.Customers.AddAsync(model.ToEntity());
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                //_commonLogService.LogError(ex, "Create New User", "", "UserService/RegisterUserAsync");
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<CustomerListResponseModel> GetCustomerListAsync()
        {
            CustomerListResponseModel responseModel = new CustomerListResponseModel();
            try
            {
                //_commonLogService.LogInfo("GetUserListAsync", "", "UserService/GetUserListAsync", null);
                var customers = await _context.Customers.Select(x => new CustomerModel
                {
                    CustomerId = x.CustomerId,
                    CustomerName = x.CustomerName,
                    PhoneNumber = x.PhoneNumber,
                    Address = x.Address,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,

                }).ToListAsync();
                responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
                responseModel.DataLst = customers;
                return responseModel;

            }
            catch (Exception ex)
            {
                //_commonLogService.LogError(ex, "GetUserListAsync", "", "UserService/GetUserListAsync");
                responseModel.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                responseModel.baseResponseModel.RespMessage = ex.Message;
                return responseModel;
            }
        }

        public async Task<ApiResponseModel> UpdateCustomerAsync(CustomerModel model)
        {
            //string methodName = $"{GetType().Name}/{nameof(RegisterUserAsync)}";
            try
            {
                //_commonLogService.LogInfo("Create New User", "", methodName, JsonConvert.SerializeObject(model));
                Customer customer = await _context.Customers.FindAsync(model.CustomerId);
                if (customer != null)
                {
                    _context.Customers.Update(model.ToEntity(customer));
                    await _context.SaveChangesAsync();
                }
                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                //_commonLogService.LogError(ex, "Create New User", "", "UserService/RegisterUserAsync");
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteCustomerAsync(int customerId)
        {
            //string methodName = $"{GetType().Name}/{nameof(RegisterUserAsync)}";
            try
            {
                //_commonLogService.LogInfo("Create New User", "", methodName, JsonConvert.SerializeObject(model));
                Customer customer = await _context.Customers.FindAsync(customerId);
                if (customer != null)
                {
                    _context.Customers.Remove(customer);
                    await _context.SaveChangesAsync();
                }
                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                //_commonLogService.LogError(ex, "Create New User", "", "UserService/RegisterUserAsync");
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
