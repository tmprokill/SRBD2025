namespace Domain.Models;

public class Borrowing
{
    public int BorrowID { get; set; }

    public int ReaderID { get; set; }

    public Reader? Reader { get; set; }

    public int BookID { get; set; }

    public Book? Book { get; set; }

    public DateTime BorrowDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public int Quantity { get; set; }
}