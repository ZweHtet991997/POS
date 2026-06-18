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
                if (await CheckCategoryDuplicate(model.CategoryName))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Conflict, ResponseMessageUtils.DuplicateCategory(model.CategoryName));
                }
                await _context.Categories.AddAsync(model.ToEntity());
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        private async Task<bool> CheckCategoryDuplicate(string categoryName)
        {
            bool isDuplicate = await _context.Categories.AnyAsync(c => c.CategoryName.ToLower() == categoryName.ToLower());
            return isDuplicate;
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
                if (await CheckCategoryDuplicate(model.CategoryName))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Conflict, ResponseMessageUtils.DuplicateCategory(model.CategoryName));
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

                //if (await CheckExistSubCategoryWithCategory(categoryId))
                //{
                //    return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.CannotDeleteCategoryWihtSubCategory);
                //}

                if (await CheckCategoryMappedWithProduct(categoryId))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.CannotDeleteCategory);
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

        private async Task<bool> CheckCategoryMappedWithProduct(int categoryId)
        {
            return await (
                from product in _context.Products
                join subCategory in _context.SubCategories
                    on product.SubCategoryId equals subCategory.SubCategoryId
                where subCategory.CategoryId == categoryId
                select product
            ).AnyAsync();
        }

        private async Task<bool> CheckExistSubCategoryWithCategory(int categoryId)
        {
            return await (from categry in _context.Categories
                          join subcategory in _context.SubCategories on categry.CategoryId equals subcategory.CategoryId
                          where subcategory.CategoryId == categoryId
                          select subcategory).AnyAsync();
        }
    }
}
