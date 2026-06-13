using NKPOS_V1.Services.DbServices.CompanyServices;

namespace NKPOS_V1.BusinessLogic.CompanyBusinessLogic
{
    public class CompanyBL : ICompanyBL
    {
        private readonly ICompanyService _companyService;

        public CompanyBL(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        public async Task<ApiResponseModel> CreateCompanyAsync(CompanyModel model)
        {
            var validation = ValidateCreate(model);
            if (validation != null) return validation;
            return await _companyService.CreateCompanyAsync(model);
        }

        public async Task<CompanyListResponseModel> GetAllCompaniesAsync()
        {
            return await _companyService.GetAllCompaniesAsync();
        }

        public async Task<CompanyModel?> GetCompanyByIdAsync(int companyId)
        {
            return await _companyService.GetCompanyByIdAsync(companyId);
        }

        public async Task<ApiResponseModel> UpdateCompanyAsync(CompanyModel model)
        {
            var validation = ValidateUpdate(model);
            if (validation != null) return validation;
            return await _companyService.UpdateCompanyAsync(model);
        }

        public async Task<ApiResponseModel> DeleteCompanyAsync(int companyId)
        {
            if (companyId <= 0) return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            return await _companyService.DeleteCompanyAsync(companyId);
        }

        private ApiResponseModel? ValidateCreate(CompanyModel? model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.CompanyName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }

        private ApiResponseModel? ValidateUpdate(CompanyModel? model)
        {
            if (model == null || model.CompanyId <= 0)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}
