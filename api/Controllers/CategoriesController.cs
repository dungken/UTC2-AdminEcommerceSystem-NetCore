using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Dtos.Category;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IBaseReponseService _baseReponseService;

        public CategoriesController(
            ICategoryService categoryService,
            IBaseReponseService baseReponseService
            )
        {
            _categoryService = categoryService;
            _baseReponseService = baseReponseService;
        }

        //////////////////////////// POST: api/Categories ////////////////////////////
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Category data is required."));
            }

            var createdCategory = await _categoryService.CreateCategoryAsync(categoryDto);
            return CreatedAtAction(nameof(GetCategoryById), new { id = createdCategory.Id }, createdCategory);
        }

        //////////////////////////// GET: api/Categories/{id} ////////////////////////////
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Category not found."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(category));
        }


        //////////////////////////// GET: api/Categories ////////////////////////////
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(_baseReponseService.CreateSuccessResponse(categories));
        }

        //////////////////////////// GET: api/Categories/subcategories/{parentCategoryId} ////////////////////////////
        [HttpGet("subcategories/{parentCategoryId}")]
        public async Task<IActionResult> GetSubCategories(Guid parentCategoryId)
        {
            var subCategories = await _categoryService.GetSubCategoriesAsync(parentCategoryId);
            return Ok(_baseReponseService.CreateSuccessResponse(subCategories));
        }


        //////////////////////////// PUT: api/Categories/{id} ////////////////////////////
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryDto categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Category data is required."));
            }

            var updatedCategory = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            if (updatedCategory == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Category not found."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(updatedCategory));
        }


        //////////////////////////// DELETE: api/Categories/{id} ////////////////////////////
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var success = await _categoryService.DeleteCategoryAsync(id);
            if (!success)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Category not found."));
            }
            return NoContent();
        }
    }






}