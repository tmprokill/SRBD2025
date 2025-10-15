namespace Infrastructure.Common.Errors.Common;

public class EmailError
{
    public static Error EmailNotSent()
    {
        return Error.NotFound("common.email-not-sent", "Email cannot be send to user");
    }

    public static Error InvalidOrExpiredToken()
    {
        return Error.NotFound("common.email-invalid-or-expired-token",
            "Token to activate email is either invalid or expired");
    }
}