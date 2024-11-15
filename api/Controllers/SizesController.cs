using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Dtos.Product;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizesController : ControllerBase
    {
        private readonly ISizeService _sizeService;

        public SizesController(ISizeService sizeService)
        {
            _sizeService = sizeService;
        }

        // GET: api/sizes
        [HttpGet]
        public async Task<IActionResult> GetAllSizes()
        {
            var sizes = await _sizeService.GetAllSizesAsync();
            return Ok(sizes);
        }

        // GET: api/sizes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSizeById(Guid id)
        {
            var size = await _sizeService.GetSizeByIdAsync(id);
            if (size == null)
            {
                return NotFound($"Size with ID {id} not found.");
            }
            return Ok(size);
        }

        // POST: api/sizes
        [HttpPost]
        public async Task<IActionResult> CreateSize([FromBody] SizeDTO sizeDTO)
        {
            if (sizeDTO == null)
            {
                return BadRequest("Invalid data.");
            }

            var createdSize = await _sizeService.CreateSizeAsync(sizeDTO);
            return CreatedAtAction(nameof(GetSizeById), new { id = createdSize.Id }, createdSize);
        }

        // PUT: api/sizes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSize(Guid id, [FromBody] SizeDTO sizeDTO)
        {
            if (sizeDTO == null || id != sizeDTO.Id)
            {
                return BadRequest("Invalid data.");
            }

            var updatedSize = await _sizeService.UpdateSizeAsync(id, sizeDTO);
            if (updatedSize == null)
            {
                return NotFound($"Size with ID {id} not found.");
            }

            return Ok(updatedSize);
        }

        // DELETE: api/sizes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSize(Guid id)
        {
            var result = await _sizeService.DeleteSizeAsync(id);
            if (!result)
            {
                return NotFound($"Size with ID {id} not found.");
            }

            return NoContent(); // Successfully deleted
        }

    }
}