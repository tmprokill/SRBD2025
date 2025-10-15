namespace Domain.Models;

public class Book
{
    public int BookID { get; set; }

    public string Title { get; set; }

    public int AuthorID { get; set; }

    public Author? Author { get; set; }

    public int GenreID { get; set; }

    public Genre? Genre { get; set; }

    public double Price { get; set; }

    public int Quantity { get; set; }
    
    public string? Description { get; set; }
}