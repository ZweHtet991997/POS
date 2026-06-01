using Microsoft.AspNetCore.Mvc;

namespace NKPOS_V1.Controllers
{
    public class SubCategoryController : Controller
    {
        private readonly ISubCategoryBL _subCategoryBL;

        public SubCategoryController(ISubCategoryBL subCategoryBL)
        {
            _subCategoryBL = subCategoryBL;
        }

        [HttpPost("api/v1/subcategory")]
        public async Task<IActionResult> CreateSubCategory([FromBody] SubCategoryModel model)
        {
            return StatusCode(200, await _subCategoryBL.CreateSubCategoryAsync(model));
        }

        [HttpGet("api/v1/subcategory")]
        public async Task<IActionResult> GetAllSubCategories()
        {
            return StatusCode(200, await _subCategoryBL.GetAllSubCategoriesAsync());
        }

        [HttpGet("api/v1/subcategory/{subCategoryId}")]
        public async Task<IActionResult> GetSubCategoryById(int subCategoryId)
        {
            return StatusCode(200, await _subCategoryBL.GetSubCategoryByIdAsync(subCategoryId));
        }

        [HttpPut("api/v1/subcategory")]
        public async Task<IActionResult> UpdateSubCategory([FromBody] SubCategoryModel model)
        {
            return StatusCode(200, await _subCategoryBL.UpdateSubCategoryAsync(model));
        }

        [HttpDelete("api/v1/subcategory/{subCategoryId}")]
        public async Task<IActionResult> DeleteSubCategory(int subCategoryId)
        {
            return StatusCode(200, await _subCategoryBL.DeleteSubCategoryAsync(subCategoryId));
        }
    }
}
