namespace NKPOS_V1.Models
{
    public class WarehouseModel
    {
        public int WarehouseId { get; set; }
        public int? ProductId { get; set; }
        public string? WarehouseName { get; set; }
        public string? WarehouseAddress { get; set; }
        public int? StockQuantity { get; set; }
        public string? ManagerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LastUpdatedDate { get; set; }
        public bool? IsActive { get; set; }
    }

    public class WarehouseListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<WarehouseResponseModel> DataLst { get; set; } = new List<WarehouseResponseModel>();
    }

    public class WarehouseResponseModel
    {
        public int WarehouseId { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? WarehouseName { get; set; }
        public string? WarehouseAddress { get; set; }
        public int? StockQuantity { get; set; }
        public string? ManagerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LastUpdatedDate { get; set; }
    }
}
