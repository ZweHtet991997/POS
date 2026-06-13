namespace NKPOS_V1.Services.DbServices.CompanyServices
{
    public interface ICompanyService
    {
        Task<ApiResponseModel> CreateCompanyAsync(CompanyModel model);
        Task<CompanyListResponseModel> GetAllCompaniesAsync();
        Task<CompanyModel?> GetCompanyByIdAsync(int companyId);
        Task<ApiResponseModel> UpdateCompanyAsync(CompanyModel model);
        Task<ApiResponseModel> DeleteCompanyAsync(int companyId);
    }
}
