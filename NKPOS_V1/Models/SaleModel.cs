namespace NKPOS_V1.Models
{
    public class SaleModel
    {
        public int SalesId { get; set; }
        public string? SaleNo { get; set; }
        public int? BusinessId { get; set; }
        public string? CustomerName { get; set; }
        public string? SaleMode { get; set; }
        public string? SaleType { get; set; }
        public string? PaymentType { get; set; }
        public bool? IsCredit { get; set; }
        public string? DiscountType { get; set; }
        public int? DiscountValue { get; set; }
        public int? DiscountAmount { get; set; }
        public int? TaxPercentage { get; set; }
        public int? TaxAmount { get; set; }
        public int? SubTotal { get; set; }
        public int? GrandTotal { get; set; }
        public int? InitialAmount { get; set; }
        public int? PaidAmount { get; set; }
        public int? ChangeAmount { get; set; }
        public string? Remark { get; set; }
        public string? SaleDate { get; set; }
        public int? CreatedBy { get; set; }
        public List<SaleItemsModel> Items { get; set; } = new List<SaleItemsModel>();
    }

    public class SaleResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public SaleModel? Data { get; set; }
    }

    public class SaleListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<SaleModel> DataLst { get; set; } = new List<SaleModel>();
    }
}
