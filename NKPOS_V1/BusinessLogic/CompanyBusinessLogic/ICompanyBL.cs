namespace NKPOS_V1.BusinessLogic.CompanyBusinessLogic
{
    public interface ICompanyBL
    {
        Task<ApiResponseModel> CreateCompanyAsync(CompanyModel model);
        Task<CompanyListResponseModel> GetAllCompaniesAsync();
        Task<CompanyModel?> GetCompanyByIdAsync(int companyId);
        Task<ApiResponseModel> UpdateCompanyAsync(CompanyModel model);
        Task<ApiResponseModel> DeleteCompanyAsync(int companyId);
    }
}
