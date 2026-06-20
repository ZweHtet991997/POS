namespace NKPOS_V1.Services.DbServices.SaleServices
{
    public class SaleService : ISaleService
    {
        private readonly EFDBContext _context;

        public SaleService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateSaleAsync(SaleModel model)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var sale = CreateSaleEntity(model);
                var items = CreateSaleItemEntities(model.Items);

                CalculateAndApplyTotals(model, sale, items);

                await _context.Sales.AddAsync(sale);
                await _context.SaveChangesAsync();

                foreach (var item in items)
                {
                    item.SalesId = sale.SalesId;
                }

                if (items.Count > 0)
                {
                    await _context.SaleItems.AddRangeAsync(items);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<SaleListResponseModel> GetAllSalesAsync()
        {
            var response = new SaleListResponseModel();

            try
            {
                var sales = await _context.Sales
                    .AsNoTracking()
                    .OrderByDescending(x => x.SalesId)
                    .ToListAsync();

                var saleIds = sales.Select(x => x.SalesId).ToList();
                var items = await _context.SaleItems
                    .AsNoTracking()
                    .Where(x => x.SalesId.HasValue && saleIds.Contains(x.SalesId.Value))
                    .ToListAsync();

                response.DataLst = sales
                    .Select(sale => ToModel(
                        sale,
                        items.Where(item => item.SalesId == sale.SalesId)))
                    .ToList();
                response.baseResponseModel.RespCode = EnumStatusCode.Success;
                response.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
            }
            catch (Exception ex)
            {
                response.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                response.baseResponseModel.RespMessage = ex.Message;
            }

            return response;
        }

        public async Task<SaleResponseModel> GetSaleByIdAsync(int salesId)
        {
            var response = new SaleResponseModel();

            try
            {
                var sale = await _context.Sales
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.SalesId == salesId);

                if (sale == null)
                {
                    response.baseResponseModel.RespCode = EnumStatusCode.NotFound;
                    response.baseResponseModel.RespMessage = "Sale not found.";
                    return response;
                }

                var items = await _context.SaleItems
                    .AsNoTracking()
                    .Where(x => x.SalesId == salesId)
                    .ToListAsync();

                response.Data = ToModel(sale, items);
                response.baseResponseModel.RespCode = EnumStatusCode.Success;
                response.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
            }
            catch (Exception ex)
            {
                response.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                response.baseResponseModel.RespMessage = ex.Message;
            }

            return response;
        }

        public async Task<ApiResponseModel> UpdateSaleAsync(SaleModel model)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var sale = await _context.Sales
                    .FirstOrDefaultAsync(x => x.SalesId == model.SalesId);

                if (sale == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Sale not found.");
                }

                var oldItems = await _context.SaleItems
                    .Where(x => x.SalesId == model.SalesId)
                    .ToListAsync();

                var newItems = CreateSaleItemEntities(model.Items);
                UpdateSaleEntity(model, sale);
                CalculateAndApplyTotals(model, sale, newItems);

                _context.SaleItems.RemoveRange(oldItems);

                foreach (var item in newItems)
                {
                    item.SalesId = sale.SalesId;
                }

                if (newItems.Count > 0)
                {
                    await _context.SaleItems.AddRangeAsync(newItems);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteSaleAsync(int salesId)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var sale = await _context.Sales
                    .FirstOrDefaultAsync(x => x.SalesId == salesId);

                if (sale == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Sale not found.");
                }

                var items = await _context.SaleItems
                    .Where(x => x.SalesId == salesId)
                    .ToListAsync();

                _context.SaleItems.RemoveRange(items);
                _context.Sales.Remove(sale);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        private static Sale CreateSaleEntity(SaleModel model)
        {
            var sale = new Sale
            {
                SaleNo = null,
                SaleDate = GetMyanmarTime.GetCurrentMyanmarTime()
            };

            UpdateSaleEntity(model, sale);
            return sale;
        }

        private static void UpdateSaleEntity(SaleModel model, Sale sale)
        {
            sale.BusinessId = model.BusinessId;
            sale.CustomerName = model.CustomerName;
            sale.SaleMode = model.SaleMode;
            sale.SaleType = model.SaleType;
            sale.PaymentType = model.PaymentType;
            sale.IsCredit = model.IsCredit;
            sale.DiscountType = model.DiscountType;
            sale.DiscountValue = Math.Max(model.DiscountValue ?? 0, 0);
            sale.InitialAmount = Math.Max(model.InitialAmount ?? 0, 0);
            sale.PaidAmount = Math.Max(model.PaidAmount ?? 0, 0);
            sale.Remark = model.Remark;
            sale.CreatedBy = model.CreatedBy ?? sale.CreatedBy;
        }

        private static List<SaleItem> CreateSaleItemEntities(IEnumerable<SaleItemsModel>? models)
        {
            return (models ?? Enumerable.Empty<SaleItemsModel>())
                .Select(model =>
                {
                    var quantity = Math.Max(model.SaleQuantity ?? 0, 0);
                    var unitPrice = Math.Max(model.UnitPrice ?? 0, 0);
                    var discountPrice = Math.Max(model.DiscountPrice ?? 0, 0);
                    var grossTotal = checked(quantity * unitPrice);
                    var totalPrice = Math.Max(grossTotal - discountPrice, 0);

                    return new SaleItem
                    {
                        ProductName = model.ProductName,
                        WarehouseName = model.WarehouseName,
                        SaleQuantity = quantity,
                        UnitPrice = unitPrice,
                        DiscountPrice = discountPrice,
                        TotalPrice = totalPrice,
                        CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
                    };
                })
                .ToList();
        }

        private static void CalculateAndApplyTotals(
            SaleModel model,
            Sale sale,
            IReadOnlyCollection<SaleItem> items)
        {
            var subTotal = checked(items.Sum(x => x.TotalPrice ?? 0));
            var discountValue = Math.Max(model.DiscountValue ?? 0, 0);
            var discountAmount = CalculateSaleDiscount(
                subTotal,
                model.DiscountType,
                discountValue);
            var taxableAmount = Math.Max(subTotal - discountAmount, 0);
            var taxPercentage = Math.Max(model.TaxPercentage ?? 0, 0);
            var taxAmount = checked((int)((long)taxableAmount * taxPercentage / 100));
            var grandTotal = checked(taxableAmount + taxAmount);
            var paidAmount = Math.Max(model.PaidAmount ?? 0, 0);

            sale.DiscountValue = discountValue;
            sale.DiscountAmount = discountAmount;
            sale.TaxPercentage = taxPercentage;
            sale.TaxAmount = taxAmount;
            sale.SubTotal = subTotal;
            sale.GrandTotal = grandTotal;
            sale.PaidAmount = paidAmount;
            sale.ChangeAmount = Math.Max(paidAmount - grandTotal, 0);
        }

        private static int CalculateSaleDiscount(
            int subTotal,
            string? discountType,
            int discountValue)
        {
            if (discountValue <= 0 || subTotal <= 0)
            {
                return 0;
            }

            var normalizedType = discountType?.Trim().ToUpperInvariant();
            var discountAmount = normalizedType switch
            {
                "%" or "PERCENT" or "PERCENTAGE" =>
                    checked((int)((long)subTotal * discountValue / 100)),
                "MMK" => discountValue,
                _ => 0
            };

            return Math.Min(discountAmount, subTotal);
        }

        private static SaleModel ToModel(Sale sale, IEnumerable<SaleItem> items)
        {
            return new SaleModel
            {
                SalesId = sale.SalesId,
                SaleNo = sale.SaleNo,
                BusinessId = sale.BusinessId,
                CustomerName = sale.CustomerName,
                SaleMode = sale.SaleMode,
                SaleType = sale.SaleType,
                PaymentType = sale.PaymentType,
                IsCredit = sale.IsCredit,
                DiscountType = sale.DiscountType,
                DiscountValue = sale.DiscountValue,
                DiscountAmount = sale.DiscountAmount,
                TaxPercentage = sale.TaxPercentage,
                TaxAmount = sale.TaxAmount,
                SubTotal = sale.SubTotal,
                GrandTotal = sale.GrandTotal,
                InitialAmount = sale.InitialAmount,
                PaidAmount = sale.PaidAmount,
                ChangeAmount = sale.ChangeAmount,
                Remark = sale.Remark,
                SaleDate = sale.SaleDate,
                CreatedBy = sale.CreatedBy,
                Items = items.Select(item => new SaleItemsModel
                {
                    SaleItemsId = item.SaleItemsId,
                    SalesId = item.SalesId,
                    ProductName = item.ProductName,
                    WarehouseName = item.WarehouseName,
                    SaleQuantity = item.SaleQuantity,
                    UnitPrice = item.UnitPrice,
                    DiscountPrice = item.DiscountPrice,
                    TotalPrice = item.TotalPrice,
                    CreatedDate = item.CreatedDate
                }).ToList()
            };
        }
    }
}
