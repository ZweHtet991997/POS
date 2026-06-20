namespace NKPOS_V1.BusinessLogic.SaleBusinessLogic
{
    public interface ISaleBL
    {
        Task<ApiResponseModel> CreateSaleAsync(SaleModel model);
        Task<SaleListResponseModel> GetAllSalesAsync();
        Task<SaleResponseModel> GetSaleByIdAsync(int salesId);
        Task<ApiResponseModel> UpdateSaleAsync(SaleModel model);
        Task<ApiResponseModel> DeleteSaleAsync(int salesId);
    }
}
