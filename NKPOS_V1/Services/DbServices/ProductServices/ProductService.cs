using ProductWarehouse = NKPOS_V1.Entities.ProductWarehouse;

namespace NKPOS_V1.Services.DbServices.ProductServices
{
    public class ProductService : IProductService
    {
        private readonly EFDBContext _context;
        private readonly IFileUploadServices _fileService;
        private readonly IWarehouseService _warehouseService;

        public ProductService(EFDBContext context, IFileUploadServices fileService, IWarehouseService warehouseService)
        {
            _context = context;
            _fileService = fileService;
            _warehouseService = warehouseService;
        }

        public async Task<ApiResponseModel> CreateProductAsync(ProductModel model)
        {
            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                bool subCategoryExists = true;

                if (model.SubCategoryId.HasValue)
                {
                    subCategoryExists = await _context.SubCategories.AnyAsync(x => x.SubCategoryId == model.SubCategoryId.Value);
                }

                if (!subCategoryExists)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.SubCategoryNotFound);
                }

                string businessName = await _context.Businesses.Where(b => b.BusinessId == model.BusinessId).Select(b => b.BusinessName).FirstOrDefaultAsync();

                Product product = model.ToEntity();
                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();

                #region ProductImageUpload
                if (model.File != null)
                {
                    var fileUploadResult = await _fileService.FileUpload(model.File, product.ProductId, businessName);
                    if (fileUploadResult.responseModel.baseResponseModel.RespCode != EnumStatusCode.Success)
                    {
                        await transaction.RollbackAsync();
                        return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.FileUploadFailed);
                    }
                    product.ImagePath = fileUploadResult.Filepath;
                    _context.Products.Update(product);
                    await _context.SaveChangesAsync();
                }
                #endregion

                #region UpdateProductStockQtyinWarehouse
                var warehouseUpdateResult = await CreateOrUpdateWarehouseAsync(model.Warehouses, product.ProductId);

                if (warehouseUpdateResult.baseResponseModel.RespCode != EnumStatusCode.Success)
                {
                    await transaction.RollbackAsync();
                    return warehouseUpdateResult;
                }
                #endregion

                await transaction.CommitAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                await transaction?.RollbackAsync();
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        private async Task<ApiResponseModel> CreateOrUpdateWarehouseAsync(
    List<WarehouseModel> warehouses,
    int productId)
        {
            try
            {
                foreach (var warehouse in warehouses)
                {
                    if (warehouse.WarehouseId <= 0)
                        continue;

                    var existingProductWarehouse = await _context.ProductWarehouse
                        .FirstOrDefaultAsync(x =>
                            x.Product_Id == productId &&
                            x.Warehouse_Id == warehouse.WarehouseId);

                    if (existingProductWarehouse != null)
                    {
                        // Update stock only
                        existingProductWarehouse.StockQuantity = warehouse.StockQuantity;
                        existingProductWarehouse.LastUpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime();

                        _context.ProductWarehouse.Update(existingProductWarehouse);
                    }
                    else
                    {
                        // Add new product warehouse
                        var newProductWarehouse = new ProductWarehouse
                        {
                            Product_Id = productId,
                            Warehouse_Id = warehouse.WarehouseId,
                            StockQuantity = warehouse.StockQuantity,
                            //UpdatedBy = 1,
                            LastUpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
                        };

                        await _context.ProductWarehouse.AddAsync(newProductWarehouse);
                    }
                }

                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(
                    EnumStatusCode.Success,
                    ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(
                    EnumStatusCode.InternalServerError,
                    ex.Message);
            }
        }

        public async Task<ProductListResponseModel> GetAllProductsAsync()
        {
            ProductListResponseModel responseModel = new ProductListResponseModel();
            try
            {
                var productList = await (
        from p in _context.Products

        join s in _context.SubCategories
            on p.SubCategoryId equals s.SubCategoryId into ps
        from s in ps.DefaultIfEmpty()

        where p.IsActive == true

        select new ProductResponseModel
        {
            ProductId = p.ProductId,
            ProductName = p.ProductName,
            BusinessId = p.BusinessId,
            SubCategoryId = s != null ? s.SubCategoryId : 0,
            SubCategoryName = s != null ? s.SubCategoryName : null,

            FilePath = p.ImagePath,
            UnitPrice = p.UnitPrice,
            RetailPrice = p.RetailPrice,
            WholeSalePrice = p.WholeSalePrice,
            Description = p.Description,
            IsActive = p.IsActive,
            CreatedDate = p.CreatedDate,
            CreatedBy = p.CreatedBy,

            Warehouses = (from pw in _context.ProductWarehouse
                          join w in _context.Warehouses
                              on pw.Warehouse_Id equals w.WarehouseId
                          where pw.Product_Id == p.ProductId
                          select new ProductWarehouseModel
                          {
                              WarehouseId = w.WarehouseId,
                              WarehouseName = w.WarehouseName,
                              StockQuantity = pw.StockQuantity
                          }).ToList()
        }).ToListAsync();

                responseModel.DataLst = productList;
                responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
                return responseModel;
            }
            catch (Exception ex)
            {
                responseModel.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                responseModel.baseResponseModel.RespMessage = ex.Message;
                return responseModel;
            }
        }

        public async Task<ProductResponseModel> GetProductByIdAsync(int productId)
        {
            try
            {
                var product = await (
                    from p in _context.Products
                    join s in _context.SubCategories
                        on p.SubCategoryId equals s.SubCategoryId into ps
                    from s in ps.DefaultIfEmpty()
                    where p.IsActive == true && p.ProductId == productId
                    select new ProductResponseModel
                    {
                        ProductId = p.ProductId,
                        ProductName = p.ProductName,
                        //CategoryId = c.CategoryId,
                        //CategoryName = c.CategoryName,
                        SubCategoryId = s.SubCategoryId,
                        SubCategoryName = s.SubCategoryName,
                        FilePath = p.ImagePath,
                        UnitPrice = p.UnitPrice,
                        RetailPrice = p.RetailPrice,
                        WholeSalePrice = p.WholeSalePrice,
                        Description = p.Description,
                        IsActive = p.IsActive,
                        CreatedDate = p.CreatedDate,
                        CreatedBy = p.CreatedBy,
                        Warehouses = (from pw in _context.ProductWarehouse
                                      join w in _context.Warehouses
                                          on pw.Warehouse_Id equals w.WarehouseId
                                      where pw.Product_Id == p.ProductId
                                      select new ProductWarehouseModel
                                      {
                                          WarehouseId = w.WarehouseId,
                                          WarehouseName = w.WarehouseName,
                                          StockQuantity = pw.StockQuantity
                                      }).ToList()
                    }).FirstOrDefaultAsync();
                return product;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ApiResponseModel> UpdateProductAsync(ProductModel model)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == model.ProductId);

                if (product == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Product not found.");
                }

                if (model.SubCategoryId.HasValue)
                {
                    bool subCategoryExists = await _context.SubCategories.AnyAsync(x => x.SubCategoryId == model.SubCategoryId.Value);
                    if (!subCategoryExists)
                    {
                        return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.SubCategoryNotFound);
                    }
                }

                #region NewProductImageUpload

                if (model.File != null && model.File.Length > 0)
                {
                    var deleteFileResult = await _fileService.DeleteFile(product.ImagePath, true);

                    if (deleteFileResult.baseResponseModel.RespCode != EnumStatusCode.Success)
                    {
                        return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.FileUploadFailed);
                    }
                    else
                    {
                        string businessName = await _context.Businesses.Where(b => b.BusinessId == model.BusinessId).Select(b => b.BusinessName).FirstOrDefaultAsync();
                        var fileUploadResult = await _fileService.FileUpload(model.File, product.ProductId, businessName);
                        if (fileUploadResult.responseModel.baseResponseModel.RespCode != EnumStatusCode.Success)
                        {
                            return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.FileUploadFailed);
                        }
                        product.ImagePath = fileUploadResult.Filepath;
                    }
                }

                #endregion

                _context.Products.Update(model.ToEntity(product));
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteProductAsync(int productId)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == productId);

                if (product == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Product not found.");
                }

                _context.Products.Remove(product);
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
