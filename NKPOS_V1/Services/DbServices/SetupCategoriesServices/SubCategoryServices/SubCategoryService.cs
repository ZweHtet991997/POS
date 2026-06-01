namespace NKPOS_V1.Services.DbServices.SetupCategoriesServices.SubCategoryServices
{
    public class SubCategoryService : ISubCategoryService
    {
        private readonly EFDBContext _context;

        public SubCategoryService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateSubCategoryAsync(SubCategoryModel model)
        {
            try
            {
                bool categoryExists = await _context.Categories.AnyAsync(x => x.CategoryId == model.CategoryId);

                if (!categoryExists)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.CategoryNotFound);
                }

                await _context.SubCategories.AddAsync(model.ToEntity());
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<SubCategoryListResponseModel> GetAllSubCategoriesAsync()
        {
            SubCategoryListResponseModel responseModel = new SubCategoryListResponseModel();
            try
            {
                responseModel.DataLst = await _context.SubCategories
                .Select(s => new SubCategoryResponseModel
                {
                    SubCategoryId = s.SubCategoryId,
                    CategoryId = s.SubCategoryId,
                    SubCategoryName = s.SubCategoryName,
                    Description = s.Description,
                    CreatedDate = s.CreatedDate,
                    UpdatedDate = s.UpdatedDate,
                })
                .ToListAsync();
                responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
                responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
                return responseModel;
            }
            catch (Exception ex)
            {
                responseModel.baseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                responseModel.baseResponseModel.RespMessage = ex.Message;
                return responseModel;
            }
        }

        public async Task<SubCategoryResponseModel> GetSubCategoryByIdAsync(int subCategoryId)
        {
            try
            {
                return await _context.SubCategories
                    .Where(s => s.SubCategoryId == subCategoryId && s.IsActive == true)
                    .Select(s => new SubCategoryResponseModel
                    {
                        SubCategoryId = s.SubCategoryId,
                        CategoryId = s.CategoryId,
                        SubCategoryName = s.SubCategoryName,
                        Description = s.Description,
                        CreatedDate = s.CreatedDate,
                        UpdatedDate = s.UpdatedDate,
                    }).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                return new SubCategoryResponseModel();
            }
        }

        public async Task<ApiResponseModel> UpdateSubCategoryAsync(SubCategoryModel model)
        {
            try
            {
                var subCategory = await _context.SubCategories.FirstOrDefaultAsync(x => x.SubCategoryId == model.SubCategoryId);

                if (subCategory == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.SubCategoryNotFound);
                }

                bool categoryExists = await _context.Categories.AnyAsync(x => x.CategoryId == model.CategoryId);

                if (!categoryExists)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.CategoryNotFound);
                }

                model.ToEntity(subCategory);
                _context.SubCategories.Update(subCategory);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteSubCategoryAsync(int subCategoryId)
        {
            try
            {
                var subCategory = await _context.SubCategories.FirstOrDefaultAsync(x => x.SubCategoryId == subCategoryId);

                if (subCategory == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.SubCategoryNotFound);
                }

                _context.SubCategories.Remove(subCategory);
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
