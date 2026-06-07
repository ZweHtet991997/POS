namespace NKPOS_V1.BusinessLogic.CustomerBusinessLogic
{
    public interface ICustomerBL
    {
        Task<ApiResponseModel> CreateCustomerAsync(CustomerModel model);
        Task<ApiResponseModel> DeleteCustomerAsync(int customerId);
        Task<CustomerListResponseModel> GetCustomerListAsync();
        Task<ApiResponseModel> UpdateCustomerAsync(CustomerModel model);
    }
}