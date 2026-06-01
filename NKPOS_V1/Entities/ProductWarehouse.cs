namespace NKPOS_V1.Entities
{
    [Table("Tbl_ProductWarehouse")]
    public class ProductWarehouse
    {
        [Key]
        [Column("ProductWarehouse_Id")]
        public int? ProductWarehouse_Id { get; set; }

        [Column("Product_Id")]
        public int? Product_Id { get; set; }

        [Column("Warehouse_Id")]
        public int? Warehouse_Id { get; set; }

        [Column("StockQuantity")]
        public int? StockQuantity { get; set; }

        [Column("LastUpdatedDate")]
        public string? LastUpdatedDate { get; set; }

        [Column("UpdatedBy")]
        public int? UpdatedBy { get; set; }
    }
}
