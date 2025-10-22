namespace Domain.DTOs;

public class SaleDTO
{
    public int ReaderID { get; set; }

    public int BookID { get; set; }
    
    public DateTime? SaleDate { get; set; }
    
    public int Quantity { get; set; }
    
    public double Price { get; set; }
}