namespace NKPOS_V1.Services.DbServices.SetupCategoriesServices.SubCategoryServices
{
    public interface ISubCategoryService
    {
        Task<ApiResponseModel> CreateSubCategoryAsync(SubCategoryModel model);
        Task<SubCategoryListResponseModel> GetAllSubCategoriesAsync();
        Task<SubCategoryResponseModel> GetSubCategoryByIdAsync(int subCategoryId);
        Task<ApiResponseModel> UpdateSubCategoryAsync(SubCategoryModel model);
        Task<ApiResponseModel> DeleteSubCategoryAsync(int subCategoryId);
    }
}
