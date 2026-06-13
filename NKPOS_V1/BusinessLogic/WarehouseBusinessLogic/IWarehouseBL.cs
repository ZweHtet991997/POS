namespace NKPOS_V1.BusinessLogic.WarehouseBusinessLogic
{
    public interface IWarehouseBL
    {
        Task<ApiResponseModel> CreateWarehouseAsync(WarehouseModel model);
        Task<WarehouseListResponseModel> GetAllWarehousesAsync();
        Task<WarehouseResponseModel> GetWarehouseByIdAsync(int warehouseId);
        Task<WarehouseTransferModel> GetWarehouseTransferListAsync(int? warehouseId = null);
        Task<ApiResponseModel> UpdateWarehouseAsync(WarehouseModel model);
        Task<ApiResponseModel> DeleteWarehouseAsync(int warehouseId);
    }
}