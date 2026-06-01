namespace NKPOS_V1.Models
{
    public class BusinessModel
    {
        public int? BusinessId { get; set; }
        public string? BusinessName { get; set; }
    }

    public class BusinessListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<BusinessModel> DataLst { get; set; } = new List<BusinessModel>();
    }
}