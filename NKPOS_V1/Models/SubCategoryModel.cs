namespace NKPOS_V1.Models
{
    public class SubCategoryModel
    {
        public int SubCategoryId { get; set; }
        public int? CategoryId { get; set; }
        public string? SubCategoryName { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class SubCategoryListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<SubCategoryResponseModel> DataLst { get; set; } = new List<SubCategoryResponseModel>();
    }

    public class SubCategoryResponseModel
    {
        public int SubCategoryId { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? SubCategoryName { get; set; }
        public string? Description { get; set; }
        public string? CreatedDate { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
