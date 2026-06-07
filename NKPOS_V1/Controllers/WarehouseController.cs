using Microsoft.AspNetCore.Mvc;

namespace NKPOS_V1.Controllers
{
    public class WarehouseController : Controller
    {
        private readonly IWarehouseBL _warehouseBL;

        public WarehouseController(IWarehouseBL warehouseBL)
        {
            _warehouseBL = warehouseBL;
        }

        [HttpPost("api/v1/warehouse")]
        public async Task<IActionResult> CreateWarehouse([FromBody] WarehouseModel model)
        {
            return StatusCode(200, await _warehouseBL.CreateWarehouseAsync(model));
        }

        [HttpGet("api/v1/warehouse")]
        public async Task<IActionResult> GetAllWarehouses()
        {
            return StatusCode(200, await _warehouseBL.GetAllWarehousesAsync());
        }

        [HttpGet("api/v1/warehouse/{warehouseId}")]
        public async Task<IActionResult> GetWarehouseById(int warehouseId)
        {
            return StatusCode(200, await _warehouseBL.GetWarehouseByIdAsync(warehouseId));
        }

        [HttpPut("api/v1/warehouse")]
        public async Task<IActionResult> UpdateWarehouse([FromBody] WarehouseModel model)
        {
            return StatusCode(200, await _warehouseBL.UpdateWarehouseAsync(model));
        }

        [HttpDelete("api/v1/warehouse")]
        public async Task<IActionResult> DeleteWarehouse(int warehouseId)
        {
            return StatusCode(200, await _warehouseBL.DeleteWarehouseAsync(warehouseId));
        }
    }
}
