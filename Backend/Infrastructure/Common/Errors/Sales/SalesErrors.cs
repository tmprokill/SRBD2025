namespace Infrastructure.Common.Errors.Sales;

public static class SalesErrors
{
    public static readonly Error NotWorkingDays =
        Error.Validation("sales.NOT_WORKING_DAYS", "You cannot modify sales on weekends (Saturday and Sunday)");

    public static readonly Error NotWorkingHours =
        Error.Validation("sales.NOT_WORKING_HOURS", "You cannot modify sales outside working hours (9:00 AM - 6:00 PM)");
}

