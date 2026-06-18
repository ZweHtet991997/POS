namespace NKPOS_V1.BusinessLogic.ProductBusinessLogic
{
    public class ProductBL : IProductBL
    {
        private readonly IProductService _productService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductBL(IProductService productService, IHttpContextAccessor httpContextAccessor)
        {
            _productService = productService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ApiResponseModel> CreateProductAsync(ProductModel model)
        {
            var validation = ValidateCreateProduct(model);
            model.BusinessId = model.BusinessId = Convert.ToInt32(_httpContextAccessor.HttpContext?.Items["BusinessId"]);
            if (validation != null) return validation;

            return await _productService.CreateProductAsync(model);
        }

        public async Task<ProductListResponseModel> GetAllProductsAsync()
        {
            return await _productService.GetAllProductsAsync();
        }

        public async Task<ProductResponseModel> GetProductByIdAsync(int productId)
        {
            return await _productService.GetProductByIdAsync(productId);
        }

        public async Task<ApiResponseModel> UpdateProductAsync(ProductModel model)
        {
            var validation = ValidateUpdateProduct(model);
            if (validation != null) return validation;

            return await _productService.UpdateProductAsync(model);
        }

        public async Task<ApiResponseModel> DeleteProductAsync(int productId)
        {
            if (productId <= 0) return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            return await _productService.DeleteProductAsync(productId);
        }

        private ApiResponseModel? ValidateCreateProduct(ProductModel? model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.ProductName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }

        private ApiResponseModel? ValidateUpdateProduct(ProductModel? model)
        {
            if (model == null || model.ProductId <= 0)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}
