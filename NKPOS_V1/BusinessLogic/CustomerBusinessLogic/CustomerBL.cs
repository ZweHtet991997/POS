using System.Text.RegularExpressions;

namespace NKPOS_V1.BusinessLogic.CustomerBusinessLogic
{
    public class CustomerBL : ICustomerBL
    {
        private readonly ICustomerService _customerService;
        private readonly IHttpContextAccessor _contextAccessor;

        public CustomerBL(ICustomerService customerService, IHttpContextAccessor contextAccessor)
        {
            _customerService = customerService;
            _contextAccessor = contextAccessor;
        }

        public async Task<ApiResponseModel> CreateCustomerAsync(CustomerModel model)
        {
            model.CreatedBy = Convert.ToInt32(_contextAccessor.HttpContext?.Items["UserId"]);
<<<<<<< HEAD
            if (!Regex.IsMatch(model.PhoneNumber, @"^\+?\d+$"))
=======
            model.CustomerName = model.CustomerName?.Trim();
            model.PhoneNumber = model.PhoneNumber?.Trim();
            model.Address = model.Address?.Trim();

            if (!string.IsNullOrWhiteSpace(model.PhoneNumber) && !Regex.IsMatch(model.PhoneNumber, @"^\+?\d+$"))
>>>>>>> d217d83 (Product integration in sale done)
            {
                return ResponseBuilder.CreateResponse(
                    EnumStatusCode.BadRequest,
                    ResponseMessageUtils.InvalidPhoneNumber
                );
            }
            return await _customerService.CreateCustomerAsync(model);
        }

        public async Task<CustomerListResponseModel> GetCustomerListAsync()
        {
            return await _customerService.GetCustomerListAsync();
        }

        public async Task<ApiResponseModel> UpdateCustomerAsync(CustomerModel model)
        {
            model.UpdatedBy = Convert.ToInt32(_contextAccessor.HttpContext?.Items["UserId"]);
            return await _customerService.UpdateCustomerAsync(model);
        }

        public async Task<ApiResponseModel> DeleteCustomerAsync(int customerId)
        {
            return await _customerService.DeleteCustomerAsync(customerId);
        }
    }
}
