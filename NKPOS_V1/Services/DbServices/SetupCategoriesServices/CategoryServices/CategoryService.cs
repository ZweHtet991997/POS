namespace NKPOS_V1.Services.DbServices.SetupCategoriesServices.CategoryServices
{
    public class CategoryService : ICategoryService
    {
        private readonly EFDBContext _context;

        public CategoryService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateCategoryAsync(CategoryModel model)
        {
            try
            {
                await _context.Categories.AddAsync(model.ToEntity());
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<CategoryListResponseModel> GetAllCategoriesAsync()
        {
            CategoryListResponseModel responseModel = new CategoryListResponseModel();
            try
            {
                responseModel.DataLst = await _context.Categories
                .Select(c => new CategoryResponseModel
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    UpdatedDate = c.UpdatedDate,
                })
                .ToListAsync();
                responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
                return responseModel;
            }
            catch (Exception ex)
            {
                // Logging (important)
                // _logger.LogError(ex, "Error occurred while fetching warehouse list");

                responseModel.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                responseModel.baseResponseModel.RespMessage = ex.Message;

                return responseModel;
            }
        }

        public async Task<CategoryResponseModel> GetCategoryByIdAsync(int categoryId)
        {
            try
            {
                return await _context.Categories
                    .Where(c => c.CategoryId == categoryId)
                    .Select(c => new CategoryResponseModel
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName,
                        Description = c.Description,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                    }).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                return new CategoryResponseModel();
            }
        }

        public async Task<ApiResponseModel> UpdateCategoryAsync(CategoryModel model)
        {
            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(x => x.CategoryId == model.CategoryId);

                if (category == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Category not found.");
                }

                model.ToEntity(category);
                _context.Categories.Update(category);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteCategoryAsync(int categoryId)
        {
            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(x => x.CategoryId == categoryId);

                if (category == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Category not found.");
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
