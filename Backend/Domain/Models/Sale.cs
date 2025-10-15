namespace Domain.Models;

public class Sale
{
    public int SaleID { get; set; }

    public int ReaderID { get; set; }

    public Reader? Reader { get; set; }

    public int BookID { get; set; }

    public Book? Book { get; set; }
    
    public DateTime SaleDate { get; set; }
    
    public int Quantity { get; set; }
    
    public double Price { get; set; }
}