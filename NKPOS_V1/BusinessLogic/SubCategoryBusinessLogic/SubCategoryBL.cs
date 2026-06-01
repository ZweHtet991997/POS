namespace NKPOS_V1.BusinessLogic.SubCategoryBusinessLogic
{
    public class SubCategoryBL : ISubCategoryBL
    {
        private readonly ISubCategoryService _subCategoryService;

        public SubCategoryBL(ISubCategoryService subCategoryService)
        {
            _subCategoryService = subCategoryService;
        }

        public async Task<ApiResponseModel> CreateSubCategoryAsync(SubCategoryModel model)
        {
            var validationResponse = ValidateCreateSubCategory(model);

            if (validationResponse != null)
            {
                return validationResponse;
            }

            return await _subCategoryService.CreateSubCategoryAsync(model);
        }

        public async Task<SubCategoryListResponseModel> GetAllSubCategoriesAsync()
        {
            return await _subCategoryService.GetAllSubCategoriesAsync();
        }

        public async Task<SubCategoryResponseModel> GetSubCategoryByIdAsync(int subCategoryId)
        {
            return await _subCategoryService.GetSubCategoryByIdAsync(subCategoryId);
        }

        public async Task<ApiResponseModel> UpdateSubCategoryAsync(SubCategoryModel model)
        {
            var validationResponse = ValidateUpdateSubCategory(model);

            if (validationResponse != null)
            {
                return validationResponse;
            }

            return await _subCategoryService.UpdateSubCategoryAsync(model);
        }

        public async Task<ApiResponseModel> DeleteSubCategoryAsync(int subCategoryId)
        {
            if (subCategoryId <= 0)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return await _subCategoryService.DeleteSubCategoryAsync(subCategoryId);
        }

        private ApiResponseModel? ValidateCreateSubCategory(SubCategoryModel? model)
        {
            if (model == null || model.CategoryId <= 0 || string.IsNullOrWhiteSpace(model.SubCategoryName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }

        private ApiResponseModel? ValidateUpdateSubCategory(SubCategoryModel? model)
        {
            if (model.CategoryId <= 0 || string.IsNullOrWhiteSpace(model.SubCategoryName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}
