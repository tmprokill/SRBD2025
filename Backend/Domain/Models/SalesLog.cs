namespace Domain.Models;

public class SalesLog
{
    public int Id { get; set; }
    
    public int SaleID { get; set; }
    
    public Sale? Sale { get; set; }
    
    public int NewQuantity { get; set; }
    
    public double NewPrice { get; set; }
    
    public DateTime ModifyDate { get; set; }
}