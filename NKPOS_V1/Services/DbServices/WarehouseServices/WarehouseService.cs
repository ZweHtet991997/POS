namespace NKPOS_V1.Services.DbServices.WarehouseServices
{
    public class WarehouseService : IWarehouseService
    {
        private readonly EFDBContext _context;

        public WarehouseService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateWarehouseAsync(WarehouseModel model)
        {
            try
            {
                await _context.Warehouses.AddAsync(model.ToEntity());

                await _context.SaveChangesAsync();
                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<WarehouseListResponseModel> GetAllWarehousesAsync()
        {
            var responseModel = new WarehouseListResponseModel();

            try
            {
                var warehouseList = await (
                    from w in _context.Warehouses

                    join pw in _context.ProductWarehouse
                    on w.WarehouseId equals pw.Warehouse_Id into wpw
                    from pw in wpw.DefaultIfEmpty()

                    join p in _context.Products
                        on pw.Product_Id equals p.ProductId into pwp
                    from p in pwp.DefaultIfEmpty()

                    where w.IsActive == true
                    select new WarehouseResponseModel
                    {
                        WarehouseId = w.WarehouseId,
                        WarehouseName = w.WarehouseName,
                        WarehouseAddress = w.WarehouseAddress,
                        PhoneNumber = w.PhoneNumber,
                        ManagerName = w.ManagerName,
                        StockQuantity = pw.StockQuantity,
                        LastUpdatedDate = w.LastUpdatedDate,
                        ProductId = p.ProductId,
                        ProductName = p != null ? p.ProductName : null
                    }
                ).ToListAsync();

                responseModel.DataLst = warehouseList;
                responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.Success;

                return responseModel;
            }
            catch (Exception ex)
            {
                // Logging (important)
                // _logger.LogError(ex, "Error occurred while fetching warehouse list");

                responseModel.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                responseModel.baseResponseModel.RespMessage = ex.Message;

                return responseModel;
            }
        }

        public async Task<WarehouseResponseModel> GetWarehouseByIdAsync(int warehouseId)
        {
            try
            {
                var warehouse = await (
                    from w in _context.Warehouses

                    join pw in _context.ProductWarehouse
                    on w.WarehouseId equals pw.Warehouse_Id into wpw
                    from pw in wpw.DefaultIfEmpty()

                    join p in _context.Products
                        on pw.Product_Id equals p.ProductId into pwp
                    from p in pwp.DefaultIfEmpty()

                    where w.IsActive == true
                    && w.WarehouseId == warehouseId
                    select new WarehouseResponseModel
                    {
                        WarehouseId = w.WarehouseId,
                        WarehouseName = w.WarehouseName,
                        WarehouseAddress = w.WarehouseAddress,
                        PhoneNumber = w.PhoneNumber,
                        ManagerName = w.ManagerName,
                        StockQuantity = pw.StockQuantity,
                        LastUpdatedDate = pw.LastUpdatedDate,
                        ProductId = p.ProductId,
                        ProductName = p != null ? p.ProductName : null
                    }
                ).FirstOrDefaultAsync();

                return warehouse;
            }
            catch (Exception ex)
            {
                // log error here if needed
                throw;
            }
        }

        public async Task<ApiResponseModel> UpdateWarehouseAsync(WarehouseModel model)
        {
            try
            {
                var warehouse = await _context.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == model.WarehouseId);
                if (warehouse == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Warehouse not found.");
                }
                _context.Warehouses.Update(model.ToEntity(warehouse));
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteWarehouseAsync(int warehouseId)
        {
            try
            {
                var wh = await _context.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouseId);
                if (wh == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Warehouse not found.");
                }

                _context.Warehouses.Remove(wh);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}