namespace NKPOS_V1.Endpoints
{
    public class AdminAccessEndpoints
    {
        public static List<string> AdminEndPoinstList()
        {
            return new List<string>
            {
                "/api/v1/user-register",
                "/api/v1/business",
                "/api/v1/business/{businessId}",
                "/api/v1/product",
                "/api/v1/product/{productId}",
                "/api/v1/category",
                "/api/v1/category/{categoryId}",
                "/api/v1/subcategory",
                "/api/v1/subcategory/{subcategoryId}",
                "/api/v1/warehouse",
                "/api/v1/warehouse/{warehouseId}",
                "/api/v1/userlist",
                "/api/v1/customer",
                "/api/v1/user/update",
                "/api/v1/user/inactive",
                "/api/v1/user/delete"
            };
        }
    }
}
