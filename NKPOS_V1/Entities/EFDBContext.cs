namespace NKPOS_V1.Entities
{
    public class EFDBContext : DbContext
    {
        public EFDBContext(DbContextOptions<EFDBContext> options) : base(options)
        {
        }

        public DbSet<Business> Businesses => Set<Business>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<SubCategory> SubCategories => Set<SubCategory>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<TransferStockLog> TransferStockLogs => Set<TransferStockLog>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Warehouse> Warehouses => Set<Warehouse>();
        public DbSet<ProductWarehouse> ProductWarehouse => Set<ProductWarehouse>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Business>().HasKey(x => x.BusinessId);
            modelBuilder.Entity<Category>().HasKey(x => x.CategoryId);
            modelBuilder.Entity<SubCategory>().HasKey(x => x.SubCategoryId);
            modelBuilder.Entity<Product>().HasKey(x => x.ProductId);
            modelBuilder.Entity<Sale>().HasKey(x => x.SalesId);
            modelBuilder.Entity<TransferStockLog>().HasKey(x => x.TransferId);
            modelBuilder.Entity<User>().HasKey(x => x.UserId);
            modelBuilder.Entity<Customer>().HasKey(x => x.CustomerId);
            modelBuilder.Entity<Warehouse>().HasKey(x => x.WarehouseId);
            modelBuilder.Entity<ProductWarehouse>().HasKey(x => x.ProductWarehouse_Id);
        }
    }
}
