namespace NKPOS_V1.Models
{
    public class TransferStockLogModel
    {
        public int TransferId { get; set; }
        public int? WarehouseId { get; set; }
        public int? ProductId { get; set; }
        public int? TransferQuantity { get; set; }
        public int? BusinessId { get; set; }
        public int? TransferedBy { get; set; }
        public int? TransferDate { get; set; }
    }
}
