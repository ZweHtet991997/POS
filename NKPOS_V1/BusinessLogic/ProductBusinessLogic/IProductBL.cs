namespace NKPOS_V1.BusinessLogic.ProductBusinessLogic
{
    public interface IProductBL
    {
        Task<ApiResponseModel> CreateProductAsync(ProductModel model);
        Task<ProductListResponseModel> GetAllProductsAsync();
        Task<ProductResponseModel> GetProductByIdAsync(int productId);
        Task<ApiResponseModel> UpdateProductAsync(ProductModel model);
        Task<ApiResponseModel> DeleteProductAsync(int productId);
    }
}
