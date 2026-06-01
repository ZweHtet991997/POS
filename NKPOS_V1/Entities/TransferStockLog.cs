
namespace NKPOS_V1.Entities
{
    [Table("Tbl_TransferStockLog")]
    public class TransferStockLog
    {
        [Key]
        [Column("Transfer_Id")]
        public int TransferId { get; set; }

        [Column("Warehouse_Id")]
        public int? WarehouseId { get; set; }

        [Column("Product_Id")]
        public int? ProductId { get; set; }

        [Column("TransferQuantity")]
        public int? TransferQuantity { get; set; }

        [Column("Business_Id")]
        public int? BusinessId { get; set; }

        [Column("TransferedBy")]
        public int? TransferedBy { get; set; }

        [Column("TransferDate")]
        public int? TransferDate { get; set; }

        public Warehouse? Warehouse { get; set; }

        public Product? Product { get; set; }

        public User? TransferedByUser { get; set; }
    }
}
