using Api.ApiResult;
using Domain.DTOs;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISalesRepository _salesRepository;

    public SalesController(ISalesRepository salesRepository)
    {
        _salesRepository = salesRepository;
    }

    [HttpGet("{saleId}")]
    public async Task<IActionResult> GetSaleDetails(int saleId)
    {
        var result = await _salesRepository.GetSaleDetailsAsync(saleId);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPost]
    public async Task<IActionResult> AddSale([FromBody] SaleDTO saleDto)
    {
        var result = await _salesRepository.AddSaleAsync(saleDto);

        return result.MatchNoData(
            successStatusCode: 201,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPut("{saleId}")]
    public async Task<IActionResult> UpdateSale(int saleId, [FromBody] SaleDTO saleDto)
    {
        var result = await _salesRepository.UpdateSaleAsync(saleId, saleDto);

        return result.MatchNoData(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpDelete("{saleId}")]
    public async Task<IActionResult> DeleteSale(int saleId)
    {
        var result = await _salesRepository.DeleteSaleAsync(saleId);

        return result.MatchNoData(
            successStatusCode: 204,
            failure: ApiResults.ToProblemDetails);
    }
}