namespace Infrastructure.Common.Errors.Common;

public static class ApplicationErrors
{
    public static readonly Error ApplicationError =
        Error.InternalServerError("common.application-error", "Something went wrong");
}