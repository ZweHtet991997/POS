using Microsoft.AspNetCore.Mvc;
using NKPOS_V1.BusinessLogic.SaleBusinessLogic;

namespace NKPOS_V1.Controllers
{
    public class SaleController : Controller
    {
        private readonly ISaleBL _saleBL;

        public SaleController(ISaleBL saleBL)
        {
            _saleBL = saleBL;
        }

        [HttpPost("api/v1/sale")]
        public async Task<IActionResult> CreateSale([FromBody] SaleModel model)
        {
            return StatusCode(200, await _saleBL.CreateSaleAsync(model));
        }

        [HttpGet("api/v1/sale")]
        public async Task<IActionResult> GetAllSales()
        {
            return StatusCode(200, await _saleBL.GetAllSalesAsync());
        }

        [HttpGet("api/v1/sale/detail")]
        public async Task<IActionResult> GetSaleById([FromQuery] int salesId)
        {
            return StatusCode(200, await _saleBL.GetSaleByIdAsync(salesId));
        }

        [HttpPut("api/v1/sale")]
        public async Task<IActionResult> UpdateSale([FromBody] SaleModel model)
        {
            return StatusCode(200, await _saleBL.UpdateSaleAsync(model));
        }

        [HttpDelete("api/v1/sale")]
        public async Task<IActionResult> DeleteSale([FromQuery] int salesId)
        {
            return StatusCode(200, await _saleBL.DeleteSaleAsync(salesId));
        }
    }
}
