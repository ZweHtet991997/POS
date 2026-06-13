
namespace NKPOS_V1.Helpers
{
    public static class EntityMapper
    {

        public static Category ToEntity(this CategoryModel model)
        {
            return new Category
            {
                CategoryId = model.CategoryId,
                CategoryName = model.CategoryName,
                Description = model.Description,
                IsActive = model.IsActive ?? true,
                CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
            };
        }

        public static Category ToEntity(this CategoryModel model, Category entity)
        {
            entity.CategoryName = string.IsNullOrEmpty(model.CategoryName) ? entity.CategoryName : model.CategoryName;
            entity.Description = string.IsNullOrEmpty(model.Description) ? entity.Description : model.Description;
            entity.IsActive = model.IsActive ?? entity.IsActive;
            entity.UpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime();
            return entity;
        }

        public static SubCategory ToEntity(this SubCategoryModel model)
        {
            return new SubCategory
            {
                SubCategoryId = model.SubCategoryId,
                CategoryId = model.CategoryId,
                SubCategoryName = model.SubCategoryName,
                Description = model.Description,
                IsActive = model.IsActive ?? true,
                CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
            };
        }

        public static SubCategory ToEntity(this SubCategoryModel model, SubCategory entity)
        {
            entity.CategoryId = model.CategoryId ?? entity.CategoryId;
            entity.SubCategoryName = string.IsNullOrEmpty(model.SubCategoryName) ? entity.SubCategoryName : model.SubCategoryName;
            entity.Description = string.IsNullOrEmpty(model.Description) ? entity.Description : model.Description;
            entity.IsActive = model.IsActive ?? entity.IsActive;
            entity.UpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime();
            return entity;
        }

        public static Business ToEntity(this BusinessModel model)
        {
            return new Business
            {
                BusinessName = model.BusinessName,
                CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime(),
            };
        }
        public static Product ToEntity(this ProductModel model)
        {
            return new Product
            {
                ProductId = model.ProductId,
                BusinessId = model.BusinessId,
                //CategoryId = model.CategoryId,
                SubCategoryId = model.SubCategoryId,
                ProductName = model.ProductName,
                Description = model.Description,
                UnitPrice = model.UnitPrice,
                RetailPrice = model.RetailPrice,
                WholeSalePrice = model.WholeSalePrice,
                CreatedBy = model.CreatedBy,
                IsActive = model.IsActive ?? true,
                CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
            };
        }

        public static Product ToEntity(this ProductModel model, Product entity)
        {
            entity.SubCategoryId = model.SubCategoryId ?? entity.SubCategoryId;
            entity.ProductName = string.IsNullOrEmpty(model.ProductName) ? entity.ProductName : model.ProductName;
            entity.Description = string.IsNullOrEmpty(model.Description) ? entity.Description : model.Description;
            entity.UnitPrice = model.UnitPrice ?? entity.UnitPrice;
            entity.RetailPrice = model.RetailPrice ?? entity.RetailPrice;
            entity.WholeSalePrice = model.WholeSalePrice ?? entity.WholeSalePrice;
            entity.UpdatedBy = model.UpdatedBy ?? entity.UpdatedBy;
            entity.IsActive = model.IsActive ?? entity.IsActive;
            entity.UpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime();
            return entity;
        }

        public static Sale ToEntity(this SaleModel model)
        {
            return new Sale
            {
                SalesId = model.SalesId,
                SaleNo = model.SaleNo,
                BusinessId = model.BusinessId,
                ProductId = model.ProductId,
                ProductName = model.ProductName,
                WarehouseId = model.WarehouseId,
                SaleQuantity = model.SaleQuantity,
                UnitPrice = model.UnitPrice,
                DiscountPrice = model.DiscountPrice,
                TotalPrice = model.TotalPrice,
                PaymentType = model.PaymentType,
                SaleType = model.SaleType,
                IsCredit = model.IsCredit,
                InitialAmount = model.InitialAmount,
                Remark = model.Remark,
                SaleDate = string.IsNullOrEmpty(model.SaleDate)
                    ? GetMyanmarTime.GetCurrentMyanmarTime()
                    : model.SaleDate,
                CreatedBy = model.CreatedBy
            };
        }

        public static Sale ToEntity(this SaleModel model, Sale entity)
        {
            entity.SaleNo = string.IsNullOrEmpty(model.SaleNo) ? entity.SaleNo : model.SaleNo;
            entity.BusinessId = model.BusinessId ?? entity.BusinessId;
            entity.ProductId = model.ProductId ?? entity.ProductId;
            entity.ProductName = string.IsNullOrEmpty(model.ProductName) ? entity.ProductName : model.ProductName;
            entity.WarehouseId = model.WarehouseId ?? entity.WarehouseId;
            entity.SaleQuantity = model.SaleQuantity ?? entity.SaleQuantity;
            entity.UnitPrice = model.UnitPrice ?? entity.UnitPrice;
            entity.DiscountPrice = model.DiscountPrice ?? entity.DiscountPrice;
            entity.TotalPrice = model.TotalPrice ?? entity.TotalPrice;
            entity.PaymentType = string.IsNullOrEmpty(model.PaymentType) ? entity.PaymentType : model.PaymentType;
            entity.SaleType = string.IsNullOrEmpty(model.SaleType) ? entity.SaleType : model.SaleType;
            entity.IsCredit = model.IsCredit ?? entity.IsCredit;
            entity.InitialAmount = model.InitialAmount ?? entity.InitialAmount;
            entity.Remark = string.IsNullOrEmpty(model.Remark) ? entity.Remark : model.Remark;
            entity.SaleDate = string.IsNullOrEmpty(model.SaleDate) ? entity.SaleDate : model.SaleDate;
            entity.CreatedBy = model.CreatedBy ?? entity.CreatedBy;
            return entity;
        }

        public static TransferStockLog ToEntity(this TransferStockLogModel model)
        {
            return new TransferStockLog
            {
                TransferId = model.TransferId,
                WarehouseId = model.WarehouseId,
                ProductId = model.ProductId,
                TransferQuantity = model.TransferQuantity,
                BusinessId = model.BusinessId,
                TransferedBy = model.TransferedBy,
                TransferDate = model.TransferDate
            };
        }

        public static TransferStockLog ToEntity(this TransferStockLogModel model, TransferStockLog entity)
        {
            entity.WarehouseId = model.WarehouseId ?? entity.WarehouseId;
            entity.ProductId = model.ProductId ?? entity.ProductId;
            entity.TransferQuantity = model.TransferQuantity ?? entity.TransferQuantity;
            entity.BusinessId = model.BusinessId ?? entity.BusinessId;
            entity.TransferedBy = model.TransferedBy ?? entity.TransferedBy;
            entity.TransferDate = model.TransferDate ?? entity.TransferDate;
            return entity;
        }

        public static User ToEntity(this RegisterModel model)
        {
            return new User
            {
                Business_Id = model.Business_Id,
                UserName = model.UserName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Password = model.Password,
                Role = model.Role,
                IsActive = true
            };
        }

        public static User ToEntity(this UserModel model)
        {
            return new User
            {
                UserName = model.UserName,
                Business_Id = model.Business_Id,
                Role = model.Role,
                Company = model.Company,
                Email = model.Email,
                Password = model.Password,
                PhoneNumber = model.PhoneNumber,
                IsActive = true,
                CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
            };
        }

        public static User ToEntity(this UserModel model, User entity)
        {
            entity.Business_Id = model.Business_Id ?? entity.Business_Id;
            entity.UserName = string.IsNullOrEmpty(model.UserName) ? entity.UserName : model.UserName;
            entity.Email = string.IsNullOrEmpty(model.Email) ? entity.Email : model.Email;
            entity.PhoneNumber = string.IsNullOrEmpty(model.PhoneNumber) ? entity.PhoneNumber : model.PhoneNumber;
            entity.Company = string.IsNullOrEmpty(model.Company.ToString()) ? entity.Company : model.Company;
            entity.IsActive = model.IsActive ?? entity.IsActive;
            return entity;
        }

        public static Warehouse ToEntity(this WarehouseModel model)
        {
            return new Warehouse
            {
                WarehouseName = model.WarehouseName,
                WarehouseAddress = model.WarehouseAddress,
                ManagerName = model.ManagerName,
                PhoneNumber = model.PhoneNumber,
                Description = model.Description,
                LastUpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime(),
                IsActive = model.IsActive ?? true
            };
        }

        public static Warehouse ToEntity(this WarehouseModel model, Warehouse entity)
        {
            entity.WarehouseName = string.IsNullOrEmpty(model.WarehouseName) ? entity.WarehouseName : model.WarehouseName;
            entity.WarehouseAddress = string.IsNullOrEmpty(model.WarehouseAddress) ? entity.WarehouseAddress : model.WarehouseAddress;
            entity.ManagerName = string.IsNullOrEmpty(model.ManagerName) ? entity.ManagerName : model.ManagerName;
            entity.PhoneNumber = string.IsNullOrEmpty(model.PhoneNumber) ? entity.PhoneNumber : model.PhoneNumber;
            entity.Description = string.IsNullOrEmpty(model.Description) ? entity.Description : model.Description;
            entity.IsActive = model.IsActive ?? entity.IsActive;
            entity.LastUpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime();
            return entity;
        }

        public static Customer ToEntity(this CustomerModel model)
        {
            return new Customer
            {
                CustomerName = model.CustomerName,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber,
                CreatedBy = model.CreatedBy,
                CreatedDate = GetMyanmarTime.GetCurrentMyanmarTime()
            };
        }

        public static Customer ToEntity(this CustomerModel model, Customer entity)
        {
            entity.CustomerName = model.CustomerName ?? entity.CustomerName;
            entity.PhoneNumber = model.PhoneNumber ?? entity.PhoneNumber;
            entity.Address = model.Address ?? entity.Address;
            entity.UpdatedBy = model.UpdatedBy;
            entity.UpdatedDate = GetMyanmarTime.GetCurrentMyanmarTime();
            return entity;
        }
    }
}
