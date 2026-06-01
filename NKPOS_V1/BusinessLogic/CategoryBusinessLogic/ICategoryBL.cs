namespace NKPOS_V1.BusinessLogic.CategoryBusinessLogic
{
    public interface ICategoryBL
    {
        Task<ApiResponseModel> CreateCategoryAsync(CategoryModel model);
        Task<ApiResponseModel> DeleteCategoryAsync(int categoryId);
        Task<CategoryListResponseModel> GetAllCategoriesAsync();
        Task<CategoryResponseModel> GetCategoryByIdAsync(int categoryId);
        Task<ApiResponseModel> UpdateCategoryAsync(CategoryModel model);
    }
}