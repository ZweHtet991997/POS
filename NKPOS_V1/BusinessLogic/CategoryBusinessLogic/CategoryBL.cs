namespace NKPOS_V1.BusinessLogic.CategoryBusinessLogic
{
    public class CategoryBL : ICategoryBL
    {
        private readonly ICategoryService _categoryService;

        public CategoryBL(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        public async Task<ApiResponseModel> CreateCategoryAsync(CategoryModel model)
        {
            var validationResponse = ValidateCreateCategory(model);

            if (validationResponse != null)
            {
                return validationResponse;
            }

            return await _categoryService.CreateCategoryAsync(model);
        }

        public async Task<CategoryListResponseModel> GetAllCategoriesAsync()
        {
            return await _categoryService.GetAllCategoriesAsync();
        }

        public async Task<CategoryResponseModel> GetCategoryByIdAsync(int categoryId)
        {
            return await _categoryService.GetCategoryByIdAsync(categoryId);
        }

        public async Task<ApiResponseModel> UpdateCategoryAsync(CategoryModel model)
        {
            var validationResponse = ValidateUpdateCategory(model);

            if (validationResponse != null)
            {
                return validationResponse;
            }

            return await _categoryService.UpdateCategoryAsync(model);
        }

        public async Task<ApiResponseModel> DeleteCategoryAsync(int categoryId)
        {
            if (categoryId <= 0)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return await _categoryService.DeleteCategoryAsync(categoryId);
        }

        private ApiResponseModel? ValidateCreateCategory(CategoryModel? model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.CategoryName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }

        private ApiResponseModel? ValidateUpdateCategory(CategoryModel? model)
        {
            if (model == null || model.CategoryId <= 0 || string.IsNullOrWhiteSpace(model.CategoryName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}
