namespace NKPOS_V1.Services.DbServices.ProductServices
{
    public interface IProductService
    {
        Task<ApiResponseModel> CreateProductAsync(ProductModel model);
        Task<ProductListResponseModel> GetAllProductsAsync();
        Task<ProductResponseModel> GetProductByIdAsync(int productId);
        Task<ApiResponseModel> UpdateProductAsync(ProductModel model);
        Task<ApiResponseModel> DeleteProductAsync(int productId);
    }
}
