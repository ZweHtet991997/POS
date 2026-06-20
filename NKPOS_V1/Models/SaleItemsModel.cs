namespace NKPOS_V1.Models
{
    public class SaleItemsModel
    {
        public int SaleItemsId { get; set; }
        public int? SalesId { get; set; }
        public string? ProductName { get; set; }
        public string? WarehouseName { get; set; }
        public int? SaleQuantity { get; set; }
        public int? UnitPrice { get; set; }
        public int? DiscountPrice { get; set; }
        public int? TotalPrice { get; set; }
        public string? CreatedDate { get; set; }
    }
}
