namespace NKPOS_V1.Models
{
    public class ProductModel
    {
        public int ProductId { get; set; }
        public int? BusinessId { get; set; }
        public IFormFile? File { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public int? UnitPrice { get; set; }
        public int? RetailPrice { get; set; }
        public int? WholeSalePrice { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public List<WarehouseModel> Warehouses { get; set; }
    }

    public class ProductListResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
        public List<ProductResponseModel> DataLst { get; set; } = new List<ProductResponseModel>();
    }

    public class ProductResponseModel
    {
        public int ProductId { get; set; }
        public int? BusinessId { get; set; }
        public string? FilePath { get; set; }
        //public int? CategoryId { get; set; }
        //public string? CategoryName { get; set; }
        public int? SubCategoryId { get; set; }
        public string? SubCategoryName { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public int? UnitPrice { get; set; }
        public int? RetailPrice { get; set; }
        public int? WholeSalePrice { get; set; }
        public bool? IsActive { get; set; }
        public string? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public List<ProductWarehouseModel> Warehouses { get; set; }
    }

    public class ProductWarehouseModel
    {
        public int WarehouseId { get; set; }
        public string WarehouseName { get; set; }
        public int? StockQuantity { get; set; }
    }
}
