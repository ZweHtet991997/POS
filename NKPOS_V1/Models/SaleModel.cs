namespace NKPOS_V1.Models
{
    public class SaleModel
    {
        public int SalesId { get; set; }
        public string? SaleNo { get; set; }
        public int? BusinessId { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public int? WarehouseId { get; set; }
        public int? SaleQuantity { get; set; }
        public int? UnitPrice { get; set; }
        public int? DiscountPrice { get; set; }
        public int? TotalPrice { get; set; }
        public string? PaymentType { get; set; }
        public string? SaleType { get; set; }
        public bool? IsCredit { get; set; }
        public int? InitialAmount { get; set; }
        public string? Remark { get; set; }
        public string? SaleDate { get; set; }
        public int? CreatedBy { get; set; }
    }
}
