namespace Infrastructure.Common.Errors.Borrowings;

public static class BorrowingErrors
{
    public static readonly Error BookNotFound =
        Error.NotFound("borrowings.BOOK_NOT_FOUND", "Book not found");

    public static readonly Error QuantityExceedsAvailable =
        Error.Validation("borrowings.QUANTITY_EXCEEDS_AVAILABLE", "The quantity you are trying to borrow exceeds the available stock");

    public static readonly Error BorrowingNotFound =
        Error.NotFound("borrowings.BORROWING_NOT_FOUND", "Borrowing not found");

    public static readonly Error BorrowingAlreadyReturned =
        Error.Conflict("borrowings.BORROWING_ALREADY_RETURNED", "Borrowing has already been returned");
}

