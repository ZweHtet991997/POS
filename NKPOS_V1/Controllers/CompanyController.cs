using Microsoft.AspNetCore.Mvc;
using NKPOS_V1.BusinessLogic.CompanyBusinessLogic;

namespace NKPOS_V1.Controllers
{
    public class CompanyController : Controller
    {
        private readonly ICompanyBL _companyBL;

        public CompanyController(ICompanyBL companyBL)
        {
            _companyBL = companyBL;
        }

        [HttpPost("api/v1/company")]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyModel model)
        {
            return StatusCode(200, await _companyBL.CreateCompanyAsync(model));
        }

        [HttpGet("api/v1/company")]
        public async Task<IActionResult> GetAllCompanies()
        {
            return StatusCode(200, await _companyBL.GetAllCompaniesAsync());
        }

        [HttpGet("api/v1/company/{companyId}")]
        public async Task<IActionResult> GetCompanyById(int companyId)
        {
            return StatusCode(200, await _companyBL.GetCompanyByIdAsync(companyId));
        }

        [HttpPut("api/v1/company")]
        public async Task<IActionResult> UpdateCompany([FromBody] CompanyModel model)
        {
            return StatusCode(200, await _companyBL.UpdateCompanyAsync(model));
        }

        [HttpDelete("api/v1/company")] 
        public async Task<IActionResult> DeleteCompany(int companyId)
        {
            return StatusCode(200, await _companyBL.DeleteCompanyAsync(companyId));
        }
    }
}
