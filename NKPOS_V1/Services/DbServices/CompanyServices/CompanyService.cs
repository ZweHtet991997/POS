namespace NKPOS_V1.Services.DbServices.CompanyServices
{
    public class CompanyService:ICompanyService
    {
        private readonly EFDBContext _context;

        public CompanyService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateCompanyAsync(CompanyModel model)
        {
            try
            {
                var entity = new CompanyEntity
                {
                    CompanyName = model.CompanyName,
                    CreatedDate = string.IsNullOrEmpty(model.CreatedDate) ? GetMyanmarTime.GetCurrentMyanmarTime() : model.CreatedDate
                };

                await _context.Company.AddAsync(entity);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<CompanyListResponseModel> GetAllCompaniesAsync()
        {
            var response = new CompanyListResponseModel();
            try
            {
                var list = await _context.Set<CompanyEntity>()
                    .Select(c => new CompanyModel
                    {
                        CompanyId = c.CompanyId,
                        CompanyName = c.CompanyName,
                        CreatedDate = c.CreatedDate
                    })
                    .ToListAsync();

                response.DataLst = list;
                response.BaseResponseModel.RespCode = EnumStatusCode.Success;
                response.BaseResponseModel.RespMessage = ResponseMessageUtils.Success;
            }
            catch (Exception ex)
            {
                response.BaseResponseModel.RespCode = EnumStatusCode.InternalServerError;
                response.BaseResponseModel.RespMessage = ex.Message;
            }

            return response;
        }

        public async Task<CompanyModel?> GetCompanyByIdAsync(int companyId)
        {
            return await _context.Set<CompanyEntity>()
                .Where(x => x.CompanyId == companyId)
                .Select(c => new CompanyModel
                {
                    CompanyId = c.CompanyId,
                    CompanyName = c.CompanyName,
                    CreatedDate = c.CreatedDate
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ApiResponseModel> UpdateCompanyAsync(CompanyModel model)
        {
            try
            {
                var company = await _context.Set<CompanyEntity>().FirstOrDefaultAsync(x => x.CompanyId == model.CompanyId);
                if (company == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Company not found.");
                }

                company.CompanyName = string.IsNullOrEmpty(model.CompanyName) ? company.CompanyName : model.CompanyName;
                // keep CreatedDate as-is (no UpdatedDate field available)

                _context.Set<CompanyEntity>().Update(company);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteCompanyAsync(int companyId)
        {
            try
            {
                var company = await _context.Set<CompanyEntity>().FindAsync(companyId);
                if (company == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, "Company not found.");
                }

                _context.Set<CompanyEntity>().Remove(company);
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
