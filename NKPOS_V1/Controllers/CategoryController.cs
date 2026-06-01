using Microsoft.AspNetCore.Mvc;

namespace NKPOS_V1.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ICategoryBL _categoryBL;

        public CategoryController(ICategoryBL categoryBL)
        {
            this._categoryBL = categoryBL;
        }

        [HttpPost("api/v1/category")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryModel model)
        {
            return StatusCode(200, await _categoryBL.CreateCategoryAsync(model));
        }

        [HttpGet("api/v1/category")]
        public async Task<IActionResult> GetAllCategories()
        {
            return StatusCode(200, await _categoryBL.GetAllCategoriesAsync());
        }

        [HttpGet("api/v1/category/{categoryId}")]
        public async Task<IActionResult> GetCategoryById(int categoryId)
        {
            return StatusCode(200, await _categoryBL.GetCategoryByIdAsync(categoryId));
        }

        [HttpPut("api/v1/category")]
        public async Task<IActionResult> UpdateCategory([FromBody] CategoryModel model)
        {
            return StatusCode(200, await _categoryBL.UpdateCategoryAsync(model));
        }

        [HttpDelete("api/v1/category/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            return StatusCode(200, await _categoryBL.DeleteCategoryAsync(categoryId));
        }
    }
}
