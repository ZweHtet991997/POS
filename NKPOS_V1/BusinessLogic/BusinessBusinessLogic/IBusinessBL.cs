namespace NKPOS_V1.BusinessLogic.BusinessBusinessLogic
{
    public interface IBusinessBL
    {
        Task<ApiResponseModel> CreateBusinessAsync(BusinessModel model);
        Task<BusinessListResponseModel> GetAllBusinessesAsync();
        Task<BusinessModel> GetBusinessByIdAsync(int businessId);
        Task<ApiResponseModel> UpdateBusinessAsync(BusinessModel model);
        Task<ApiResponseModel> DeleteBusinessAsync(int businessId);
    }
}