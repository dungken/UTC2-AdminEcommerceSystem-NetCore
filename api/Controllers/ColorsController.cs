using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Dtos.Product;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorsController : ControllerBase
    {
        private readonly IColorService _colorService;
        private readonly IBaseReponseService _baseReponseService;

        public ColorsController(
            IColorService colorService,
            IBaseReponseService baseReponseService
            )
        {
            _colorService = colorService;
            _baseReponseService = baseReponseService;
        }

        // GET: api/colors
        [HttpGet]
        public async Task<IActionResult> GetAllColors()
        {
            var colors = await _colorService.GetAllColorsAsync();
            if (colors == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("No colors found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(colors));
        }

        // GET: api/colors/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetColorById(Guid id)
        {
            var color = await _colorService.GetColorByIdAsync(id);
            if (color == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Color not found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(color));
        }

        // POST: api/colors
        [HttpPost]
        public async Task<IActionResult> CreateColor([FromBody] ColorDTO colorDto)
        {
            if (colorDto == null)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Color data is required."));
            }

            var createdColor = await _colorService.CreateColorAsync(colorDto);
            return CreatedAtAction(nameof(GetColorById), new { id = createdColor.Id }, createdColor);
        }

        // PUT: api/colors/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateColor(Guid id, [FromBody] ColorDTO colorDto)
        {
            if (colorDto == null || id != colorDto.Id)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Color data is required."));
            }

            var updatedColor = await _colorService.UpdateColorAsync(id, colorDto);
            if (updatedColor == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Color not found."));
            }

            return Ok(_baseReponseService.CreateSuccessResponse(updatedColor));
        }

        // DELETE: api/colors/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(Guid id)
        {
            var result = await _colorService.DeleteColorAsync(id);
            if (result == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Color not found."));
            }

            return NoContent(); // Successfully deleted
        }
    }

}