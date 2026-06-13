namespace NKPOS_V1.BusinessLogic.WarehouseBusinessLogic
{
    public class WarehouseBL : IWarehouseBL
    {
        private readonly IWarehouseService _warehouseService;

        public WarehouseBL(IWarehouseService warehouseService)
        {
            _warehouseService = warehouseService;
        }

        public async Task<ApiResponseModel> CreateWarehouseAsync(WarehouseModel model)
        {
            var validation = ValidateCreate(model);
            if (validation != null) return validation;
            return await _warehouseService.CreateWarehouseAsync(model);
        }

        public async Task<WarehouseListResponseModel> GetAllWarehousesAsync()
        {
            return await _warehouseService.GetAllWarehousesAsync();
        }

        public async Task<WarehouseResponseModel> GetWarehouseByIdAsync(int warehouseId)
        {
            return await _warehouseService.GetWarehouseByIdAsync(warehouseId);
        }

        public async Task<WarehouseTransferModel> GetWarehouseTransferListAsync(int? warehouseId = null)
        {
            return await _warehouseService.GetWarehouseTransferListAsync(warehouseId);
        }

        public async Task<ApiResponseModel> UpdateWarehouseAsync(WarehouseModel model)
        {
            var validation = ValidateUpdate(model);
            if (validation != null) return validation;
            return await _warehouseService.UpdateWarehouseAsync(model);
        }

        public async Task<ApiResponseModel> DeleteWarehouseAsync(int warehouseId)
        {
            if (warehouseId <= 0) return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            return await _warehouseService.DeleteWarehouseAsync(warehouseId);
        }

        private ApiResponseModel? ValidateCreate(WarehouseModel? model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.WarehouseName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, "Required Warehouse Name");
            }

            return null;
        }

        private ApiResponseModel? ValidateUpdate(WarehouseModel? model)
        {
            if (model == null || model.WarehouseId <= 0 || string.IsNullOrWhiteSpace(model.WarehouseName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}