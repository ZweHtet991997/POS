namespace NKPOS_V1.Services.DbServices.BusinessServices
{
    public interface IBusinessService
    {
        Task<ApiResponseModel> CreateBusinessAsync(BusinessModel model);
        Task<BusinessListResponseModel> GetAllBusinessesAsync();
        Task<BusinessModel> GetBusinessByIdAsync(int businessId);
        Task<ApiResponseModel> UpdateBusinessAsync(BusinessModel model);
        Task<ApiResponseModel> DeleteBusinessAsync(int businessId);
    }
}