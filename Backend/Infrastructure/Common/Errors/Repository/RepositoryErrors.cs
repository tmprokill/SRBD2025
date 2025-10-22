namespace Infrastructure.Common.Errors.Repository;

public static class RepositoryErrors<T>
{
    private static readonly string EntityName = typeof(T).Name;

    public static readonly Error NotFoundError =
        Error.NotFound($"common.repository-not-found-error", $"{EntityName} not found");

    public static readonly Error UpdateError =
        Error.Conflict($"common.repository-update-error", $"{EntityName} couldn't be updated");

    public static readonly Error AddError =
        Error.Conflict($"common.repository-add-error", $"{EntityName} couldn't be added");

    public static readonly Error DeleteError =
        Error.NotFound($"common.repository-delete-error", $"{EntityName} couldn't be deleted");
    
    public static readonly Error CascadeError =
        Error.NotFound($"common.repository-cascade-error", $"{EntityName} has dependencies and cannot be deleted");
}