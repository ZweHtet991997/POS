
namespace NKPOS_V1.Entities
{
    [Table("Tbl_Sales")]
    public class Sale
    {
        [Key]
        [Column("Sales_Id")]
        public int SalesId { get; set; }

        [Column("SaleNo")]
        [StringLength(50)]
        public string? SaleNo { get; set; }

        [Column("Business_Id")]
        public int? BusinessId { get; set; }

        [Column("Product_Id")]
        public int? ProductId { get; set; }

        [Column("ProductName")]
        [StringLength(50)]
        public string? ProductName { get; set; }

        [Column("Warehouse_Id")]
        public int? WarehouseId { get; set; }

        [Column("SaleQuantity")]
        public int? SaleQuantity { get; set; }

        [Column("UnitPrice")]
        public int? UnitPrice { get; set; }

        [Column("DiscountPrice")]
        public int? DiscountPrice { get; set; }

        [Column("TotalPrice")]
        public int? TotalPrice { get; set; }

        [Column("PaymentType")]
        [StringLength(50)]
        public string? PaymentType { get; set; }

        [Column("SaleType")]
        [StringLength(50)]
        public string? SaleType { get; set; }

        [Column("IsCredit")]
        public bool? IsCredit { get; set; }

        [Column("InitialAmount")]
        public int? InitialAmount { get; set; }

        [Column("Remark")]
        [StringLength(500)]
        public string? Remark { get; set; }

        [Column("SaleDate")]
        [StringLength(50)]
        public string? SaleDate { get; set; }

        [Column("CreatedBy")]
        public int? CreatedBy { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public Warehouse? Warehouse { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public User? CreatedByUser { get; set; }
    }
}
