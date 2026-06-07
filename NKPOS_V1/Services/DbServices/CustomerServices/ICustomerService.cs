namespace NKPOS_V1.Services.DbServices.CustomerServices
{
    public interface ICustomerService
    {
        Task<ApiResponseModel> CreateCustomerAsync(CustomerModel model);
        Task<ApiResponseModel> DeleteCustomerAsync(int customerId);
        Task<CustomerListResponseModel> GetCustomerListAsync();
        Task<ApiResponseModel> UpdateCustomerAsync(CustomerModel model);
    }
}