namespace NKPOS_V1.Models
{
    public class CompanyModel
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CreatedDate { get; set; }
    }

    public class CompanyListResponseModel
    {
        public BaseResponseModel BaseResponseModel { get; set; } = new BaseResponseModel();
        public List<CompanyModel> DataLst { get; set; } = new List<CompanyModel>();
    }
}
