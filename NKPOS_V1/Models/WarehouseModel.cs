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
        public string? Description { get; set; }
        public string? LastUpdatedDate { get; set; }
        public bool? IsActive { get; set; }
    }

    //public class WarehouseListResponseModel
    //{
    //    public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
    //    public List<WarehouseResponseModel> DataLst { get; set; } = new List<WarehouseResponseModel>();
    //}

    //public class WarehouseResponseModel
    //{
    //    public int WarehouseId { get; set; }
    //    public int? ProductId { get; set; }
    //    public string? ProductName { get; set; }
    //    public string? WarehouseName { get; set; }
    //    public string? WarehouseAddress { get; set; }
    //    public int? StockQuantity { get; set; }
    //    public string? ManagerName { get; set; }
    //    public string? PhoneNumber { get; set; }
    //    public string? Description { get; set; }
    //    public string? LastUpdatedDate { get; set; }
    //}

    //public class WarehouseTransferModel
    //{
    //    public int FromWarehouseId { get; set; }
    //    public int ToWarehouseId { get; set; }
    //}

    public class WarehouseListResponseModel
    {
        public BaseResponseModel BaseResponseModel { get; set; } = new BaseResponseModel();

        public List<WarehouseResponseModel> DataLst { get; set; } = new List<WarehouseResponseModel>();
    }

    public class WarehouseResponseModel
    {
        public int WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public string? WarehouseAddress { get; set; }
        public string? ManagerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Description { get; set; }
        public string? LastUpdatedDate { get; set; }

        public int ProductCount { get; set; }
        public int? TotalStockQuantity { get; set; }
        public int LowStockCount { get; set; }

        public List<WarehouseProductResponseModel> ProductLst { get; set; } = new List<WarehouseProductResponseModel>();
    }

    public class WarehouseProductResponseModel
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }

        public string? WarehouseName { get; set; }

        public int SubCategoryId { get; set; }
        public string? SubCategoryName { get; set; }

        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public int? StockQuantity { get; set; }
        public string? StockLevel { get; set; }
    }

    public class WarehouseTransferModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<WarehouseTransferHeadModel> WarehouseHeadModels { get; set; } = new List<WarehouseTransferHeadModel>();

        public List<WarehouseProductResponseModel> ProductsToTransfer { get; set; } = new List<WarehouseProductResponseModel>();
    }

    public class WarehouseTransferHeadModel
    {
        public int TotalUnits { get; set; }
        public string WarehouseName { get; set; }
        public int TotalProducts { get; set; }
    }
}
