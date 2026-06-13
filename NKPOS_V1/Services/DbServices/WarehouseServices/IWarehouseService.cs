using NKPOS_V1.Models;

namespace NKPOS_V1.Services.DbServices.WarehouseServices
{
    public interface IWarehouseService
    {
        Task<ApiResponseModel> CreateWarehouseAsync(WarehouseModel model);
        Task<WarehouseListResponseModel> GetAllWarehousesAsync();
        Task<WarehouseResponseModel> GetWarehouseByIdAsync(int warehouseId);
        Task<WarehouseTransferModel> GetWarehouseTransferListAsync(int? warehouseId = null);
        Task<ApiResponseModel> UpdateWarehouseAsync(WarehouseModel model);
        Task<ApiResponseModel> DeleteWarehouseAsync(int warehouseId);
    }
}