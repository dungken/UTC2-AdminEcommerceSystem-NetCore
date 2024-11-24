using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Dtos.Product;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IBaseReponseService _baseReponseService;

        public ProductsController(
            IProductService productService,
            IBaseReponseService baseReponseService
            )
        {
            _productService = productService;
            _baseReponseService = baseReponseService;
        }

        //////////////////////// GET: api/Products ////////////////////////
        [HttpGet]
        public async Task<ActionResult<List<ProductDTO>>> GetAllProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            if (products == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("No products found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(products));
        }

        //////////////////////// GET: api/Products/{id} ////////////////////////
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProductById(Guid id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Product not found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(product));
        }

        //////////////////////// GET: api/Products/Category/{cateId} ////////////////////////
        [HttpGet("category/{cateId}")]
        public async Task<ActionResult<List<ProductDTO>>> GetProductsByCategory(Guid cateId)
        {
            var products = await _productService.GetProductsByCategoryAsync(cateId);
            if (products == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("No products found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(products));
        }

        //////////////////////// POST: api/Products/Create ////////////////////////
        [HttpPost("Create")]
        public async Task<ActionResult<ProductDTO>> CreateProduct([FromBody] ProductDTO productDto)
        {
            if (productDto == null)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Product data is required."));
            }
            var createdProduct = await _productService.CreateProductAsync(productDto);
            return Ok(_baseReponseService.CreateSuccessResponse(new { product = createdProduct }, "Product created successfully."));
        }


        //////////////////////// PUT: api/Products/{id} //////////////////////// 
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(Guid id, [FromBody] ProductDTO productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest(_baseReponseService.CreateErrorResponse<object>("Product id mismatch."));
            }

            var result = await _productService.UpdateProductAsync(productDto);
            if (result == null)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Product not found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse(new { product = result }, "Product updated successfully."));
        }


        //////////////////////// DELETE: api/Products/{id} ////////////////////////
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            Console.WriteLine("DeleteProduct: " + id);
            var result = await _productService.DeleteProductAsync(id);
            if (!result)
            {
                return NotFound(_baseReponseService.CreateErrorResponse<object>("Product not found."));
            }
            return Ok(_baseReponseService.CreateSuccessResponse<object>(null, "Product deleted successfully."));
        }
    }

}