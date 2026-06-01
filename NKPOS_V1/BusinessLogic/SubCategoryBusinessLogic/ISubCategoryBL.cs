namespace NKPOS_V1.BusinessLogic.SubCategoryBusinessLogic
{
    public interface ISubCategoryBL
    {
        Task<ApiResponseModel> CreateSubCategoryAsync(SubCategoryModel model);
        Task<SubCategoryListResponseModel> GetAllSubCategoriesAsync();
        Task<SubCategoryResponseModel> GetSubCategoryByIdAsync(int subCategoryId);
        Task<ApiResponseModel> UpdateSubCategoryAsync(SubCategoryModel model);
        Task<ApiResponseModel> DeleteSubCategoryAsync(int subCategoryId);
    }
}
