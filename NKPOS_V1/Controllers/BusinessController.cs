using Microsoft.AspNetCore.Mvc;

namespace NKPOS_V1.Controllers
{
    public class BusinessController : Controller
    {
        private readonly IBusinessBL _businessBL;

        public BusinessController(IBusinessBL businessBL)
        {
            _businessBL = businessBL;
        }

        [HttpPost("api/v1/business")]
        public async Task<IActionResult> CreateBusiness([FromBody] BusinessModel model)
        {
            return StatusCode(200, await _businessBL.CreateBusinessAsync(model));
        }

        [HttpGet("api/v1/business")]
        public async Task<IActionResult> GetAllBusinesses()
        {
            return StatusCode(200, await _businessBL.GetAllBusinessesAsync());
        }

        [HttpGet("api/v1/business/{businessId}")]
        public async Task<IActionResult> GetBusinessById(int businessId)
        {
            return StatusCode(200, await _businessBL.GetBusinessByIdAsync(businessId));
        }

        [HttpPut("api/v1/business")]
        public async Task<IActionResult> UpdateBusiness([FromBody] BusinessModel model)
        {
            return StatusCode(200, await _businessBL.UpdateBusinessAsync(model));
        }

        [HttpDelete("api/v1/business")]
        public async Task<IActionResult> DeleteBusiness(int businessId)
        {
            return StatusCode(200, await _businessBL.DeleteBusinessAsync(businessId));
        }
    }
}
