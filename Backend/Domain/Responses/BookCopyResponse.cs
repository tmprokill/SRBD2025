namespace Domain.Responses;

public class BookCopyResponse
{
    public int BookCopyID { get; set; }
    
    public string Title { get; set; }
    
    public double OldPrice { get; set; }
    
    public double NewPrice { get; set; }
}