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
                if (await CheckSubCategoryDuplicate(model.SubCategoryName))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Conflict, ResponseMessageUtils.DuplicateCategory(model.SubCategoryName));
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

        private async Task<bool> CheckSubCategoryDuplicate(string subCategoryName)
        {
            bool isDuplicate = await _context.SubCategories.AnyAsync(c => c.SubCategoryName.ToLower() == subCategoryName.ToLower());
            return isDuplicate;
        }

        public async Task<SubCategoryListResponseModel> GetAllSubCategoriesAsync()
        {
            SubCategoryListResponseModel responseModel = new SubCategoryListResponseModel();
            try
            {
                //responseModel.DataLst = await _context.SubCategories
                //.Select(s => new SubCategoryResponseModel
                //{
                //    SubCategoryId = s.SubCategoryId,
                //    CategoryId = s.SubCategoryId,
                //    SubCategoryName = s.SubCategoryName,
                //    Description = s.Description,
                //    CreatedDate = s.CreatedDate,
                //    UpdatedDate = s.UpdatedDate,
                //})
                //.ToListAsync();
                responseModel.DataLst = await (from subcategory in _context.SubCategories.AsNoTracking()
                                               join category in _context.Categories.AsNoTracking()
                                               on subcategory.CategoryId equals category.CategoryId
                                               orderby subcategory.SubCategoryId descending
                                               select new SubCategoryResponseModel
                                               {
                                                   SubCategoryId = subcategory.SubCategoryId,
                                                   SubCategoryName = subcategory.SubCategoryName,
                                                   CategoryId = subcategory.CategoryId,
                                                   CategoryName = category.CategoryName,
                                                   Description = subcategory.Description,
                                                   CreatedDate = subcategory.CreatedDate,
                                                   UpdatedDate = subcategory.UpdatedDate
                                               }).ToListAsync();

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
                //return await _context.SubCategories
                //    .Where(s => s.SubCategoryId == subCategoryId && s.IsActive == true)
                //    .Select(s => new SubCategoryResponseModel
                //    {
                //        SubCategoryId = s.SubCategoryId,
                //        CategoryId = s.CategoryId,
                //        SubCategoryName = s.SubCategoryName,
                //        Description = s.Description,
                //        CreatedDate = s.CreatedDate,
                //        UpdatedDate = s.UpdatedDate,
                //    }).FirstOrDefaultAsync();

                return await (from subcategory in _context.SubCategories.AsNoTracking()
                              join category in _context.Categories.AsNoTracking()
                              on subcategory.CategoryId equals category.CategoryId
                              orderby subcategory.SubCategoryId descending
                              select new SubCategoryResponseModel
                              {
                                  SubCategoryId = subcategory.SubCategoryId,
                                  SubCategoryName = subcategory.SubCategoryName,
                                  CategoryId = subcategory.CategoryId,
                                  CategoryName = category.CategoryName,
                                  Description = subcategory.Description,
                                  CreatedDate = subcategory.CreatedDate,
                                  UpdatedDate = subcategory.UpdatedDate
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

                if (await CheckSubCategoryDuplicate(model.SubCategoryName))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.Conflict, ResponseMessageUtils.DuplicateSubCategory(model.SubCategoryName));
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

                if (await CheckSubCategoryMappedWithProduct(subCategoryId))
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.CannotDeleteSubCategory);
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

        private async Task<bool> CheckSubCategoryMappedWithProduct(int subCategoryId)
        {
            var dataResult = await _context.Products.FirstOrDefaultAsync(p => p.SubCategoryId == subCategoryId);
            if (dataResult is not null)
            {
                return true;
            }
            return false;
        }
    }
}
