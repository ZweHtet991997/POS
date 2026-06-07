using Microsoft.AspNetCore.Mvc;
using NKPOS_V1.BusinessLogic.ProductBusinessLogic;

namespace NKPOS_V1.Controllers
{
    public class ProductController : Controller
    {
        private readonly IProductBL _productBL;

        public ProductController(IProductBL productBL)
        {
            _productBL = productBL;
        }

        [HttpPost("api/v1/product")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductModel model)
        {
            return StatusCode(200, await _productBL.CreateProductAsync(model));
        }

        [HttpGet("api/v1/product")]
        public async Task<IActionResult> GetAllProducts()
        {
            return StatusCode(200, await _productBL.GetAllProductsAsync());
        }

        [HttpGet("api/v1/product/{productId}")]
        public async Task<IActionResult> GetProductById(int productId)
        {
            return StatusCode(200, await _productBL.GetProductByIdAsync(productId));
        }

        [HttpPut("api/v1/product")]
        public async Task<IActionResult> UpdateProduct([FromForm] ProductModel model)
        {
            return StatusCode(200, await _productBL.UpdateProductAsync(model));
        }

        [HttpDelete("api/v1/product")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            return StatusCode(200, await _productBL.DeleteProductAsync(productId));
        }
    }
}
