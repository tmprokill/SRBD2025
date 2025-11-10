namespace Infrastructure.Common.Errors.Book;

public class BookErrors
{
    public static readonly Error PercentOfCutOutOfRange =
        Error.Validation("books.PERCENT_OUT_OF_RANGE", "Percent you are trying to cut is out of range");
}