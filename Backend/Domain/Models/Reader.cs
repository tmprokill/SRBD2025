namespace Domain.Models;

public class Reader
{
    public int ReaderID {get; set;}
    
    public string FullName {get; set;}
    
    public string? Address {get; set;}
    
    public string? Phone { get; set; }
}