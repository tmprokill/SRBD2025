namespace Infrastructure.Common.Errors.Readers;

public static class ReaderErrors
{
    public static readonly Error ReaderNotFound =
        Error.NotFound("readers.READER_NOT_FOUND", "Reader not found");
}

