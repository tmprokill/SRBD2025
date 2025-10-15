namespace Domain.Models;

public class Author
{
    public int AuthorID { get; set; }
    
    public string? Pseudonym { get; set; }
    
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
}