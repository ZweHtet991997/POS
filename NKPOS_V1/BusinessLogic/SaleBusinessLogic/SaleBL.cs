namespace NKPOS_V1.BusinessLogic.SaleBusinessLogic
{
    public class SaleBL : ISaleBL
    {
        private readonly ISaleService _saleService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SaleBL(
            ISaleService saleService,
            IHttpContextAccessor httpContextAccessor)
        {
            _saleService = saleService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ApiResponseModel> CreateSaleAsync(SaleModel model)
        {
            var validation = ValidateSale(model, false);
            if (validation != null)
            {
                return validation;
            }

            ApplyAuthenticatedUser(model);
            return await _saleService.CreateSaleAsync(model);
        }

        public async Task<SaleListResponseModel> GetAllSalesAsync()
        {
            return await _saleService.GetAllSalesAsync();
        }

        public async Task<SaleResponseModel> GetSaleByIdAsync(int salesId)
        {
            if (salesId <= 0)
            {
                return new SaleResponseModel
                {
                    baseResponseModel = new BaseResponseModel
                    {
                        RespCode = EnumStatusCode.BadRequest,
                        RespMessage = ResponseMessageUtils.BadRequest
                    }
                };
            }

            return await _saleService.GetSaleByIdAsync(salesId);
        }

        public async Task<ApiResponseModel> UpdateSaleAsync(SaleModel model)
        {
            var validation = ValidateSale(model, true);
            if (validation != null)
            {
                return validation;
            }

            ApplyAuthenticatedUser(model);
            return await _saleService.UpdateSaleAsync(model);
        }

        public async Task<ApiResponseModel> DeleteSaleAsync(int salesId)
        {
            if (salesId <= 0)
            {
                return ResponseBuilder.CreateResponse(
                    EnumStatusCode.BadRequest,
                    ResponseMessageUtils.BadRequest);
            }

            return await _saleService.DeleteSaleAsync(salesId);
        }

        private static ApiResponseModel? ValidateSale(
            SaleModel? model,
            bool requiresId)
        {
            if (model == null ||
                (requiresId && model.SalesId <= 0) ||
                model.Items == null ||
                model.Items.Count == 0 ||
                model.Items.Any(item =>
                    !item.ProductId.HasValue ||
                    item.ProductId <= 0 ||
                    !item.SaleQuantity.HasValue ||
                    item.SaleQuantity <= 0 ||
                    !item.UnitPrice.HasValue ||
                    item.UnitPrice < 0 ||
                    (item.DiscountPrice ?? 0) < 0))
            {
                return ResponseBuilder.CreateResponse(
                    EnumStatusCode.BadRequest,
                    ResponseMessageUtils.BadRequest);
            }

            return null;
        }

        private void ApplyAuthenticatedUser(SaleModel model)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext?.Items["BusinessId"] != null &&
                int.TryParse(
                    httpContext.Items["BusinessId"]?.ToString(),
                    out var businessId))
            {
                model.BusinessId = businessId;
            }

            if (httpContext?.Items["UserId"] != null &&
                int.TryParse(
                    httpContext.Items["UserId"]?.ToString(),
                    out var userId))
            {
                model.CreatedBy = userId;
            }
        }
    }
}
