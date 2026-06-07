using Microsoft.AspNetCore.Mvc;

namespace NKPOS_V1.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ICustomerBL _customerBL;

        public CustomerController(ICustomerBL customerBL)
        {
            _customerBL = customerBL;
        }

        [HttpPost("api/v1/customer")]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CustomerModel model)
        {
            return StatusCode(200, await _customerBL.CreateCustomerAsync(model));
        }

        [HttpGet("api/v1/customer")]
        public async Task<IActionResult> GetCustomerListAsync()
        {
            return StatusCode(200, await _customerBL.GetCustomerListAsync());
        }

        [HttpPut("api/v1/customer")]
        public async Task<IActionResult> UpdateCustomerAsync([FromBody] CustomerModel model)
        {
            return StatusCode(200, await _customerBL.UpdateCustomerAsync(model));
        }

        [HttpDelete("api/v1/customer")]
        public async Task<IActionResult> DeleteCustomerAsync(int customerId)
        {
            return StatusCode(200, await _customerBL.DeleteCustomerAsync(customerId));
        }
    }
}
