namespace Domain.DTOs;

public class BookDTO
{
    public string Title { get; set; }

    public int AuthorID { get; set; }

    public int GenreID { get; set; }

    public double Price { get; set; }

    public int Quantity { get; set; }
    
    public string? Description { get; set; }
}