namespace NKPOS_V1.Services.DbServices.SetupCategoriesServices.CategoryServices
{
    public interface ICategoryService
    {
        Task<ApiResponseModel> CreateCategoryAsync(CategoryModel model);
        Task<ApiResponseModel> DeleteCategoryAsync(int categoryId);
        Task<CategoryListResponseModel> GetAllCategoriesAsync();
        Task<CategoryResponseModel> GetCategoryByIdAsync(int categoryId);
        Task<ApiResponseModel> UpdateCategoryAsync(CategoryModel model);
    }
}