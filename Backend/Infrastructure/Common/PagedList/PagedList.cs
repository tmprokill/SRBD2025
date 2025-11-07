namespace Infrastructure.Common.PagedList;

public class PagedList<T> : IPagedList<T>
{
    public PagedList(IEnumerable<T> currentPage, int count, int pageNumber, int pageSize)
    {
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        PageSize = pageSize;
        TotalCount = count;
        Items = currentPage;
    }
    
    public int CurrentPage { get; set; }
    
    public int TotalPages { get; set; }
    
    public int PageSize { get; set; }
    
    public int TotalCount { get; set; }
    
    public IEnumerable<T> Items { get; set; }
}