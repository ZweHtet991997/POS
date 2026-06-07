namespace NKPOS_V1.Models
{
    public class CustomerModel
    {
        public int CustomerId { get; set; }

        public string? CustomerName { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public string? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public string? UpdatedDate { get; set; }

        public int? UpdatedBy { get; set; }
    }

    public class CustomerListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<CustomerModel> DataLst { get; set; } = new List<CustomerModel>();
    }
}
