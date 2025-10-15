namespace Domain.Models;

public class BookCopy
{
    public int BookCopyID { get; set; }
    
    public int BookID { get; set; }
    
    public Book? Book { get; set; }
    
    public string Title { get; set; }
    
    public int AuthorID { get; set; }
    
    public Author? Author { get; set; }
    
    public int GenreID { get; set; }
    
    public Genre? Genre { get; set; }
    
    public double OldPrice { get; set; }
    
    public double NewPrice { get; set; }
}