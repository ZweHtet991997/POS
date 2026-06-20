
using NKPOS_V1.BusinessLogic.CompanyBusinessLogic;
using NKPOS_V1.Services.DbServices.CompanyServices;

namespace NKPOS_V1
{
    public static class RegistryService
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services, WebApplicationBuilder builder)
        {
            return services.AddCustomServices();
        }

        public static IServiceCollection AddCustomServices(this IServiceCollection services)
        {
            return services
                .AddScoped<IUserBL, UserBL>()
                .AddScoped<IUserService, UserService>()

                .AddScoped<ICategoryBL, CategoryBL>()
                .AddScoped<ICategoryService, CategoryService>()

                .AddScoped<IBusinessBL, BusinessBL>()
                .AddScoped<IBusinessService, BusinessService>()

                .AddScoped<ICompanyBL, CompanyBL>()
                .AddScoped<ICompanyService, CompanyService>()

                .AddScoped<ISubCategoryBL, SubCategoryBL>()
                .AddScoped<ISubCategoryService, SubCategoryService>()

                .AddScoped<IWarehouseBL, WarehouseBL>()
                .AddScoped<IWarehouseService, WarehouseService>()

                .AddScoped<IProductBL, ProductBL>()
                .AddScoped<IProductService, ProductService>()

                .AddScoped<ICustomerBL, CustomerBL>()
                .AddScoped<ICustomerService, CustomerService>()

                .AddScoped<ISaleService, SaleService>()
                .AddScoped<ISaleBL, SaleBL>()

                .AddScoped<IFileUploadServices, FileUploadServices>()
                .AddScoped<IFluentFTPService, FluentFTPService>()

                .AddScoped<ICommonLogService, CommonLogService>()

                .AddTransient<AESService>()
                .AddTransient<JWTAuth>()
                .AddTransient<IPasswordPolicyApiService, PasswordPolicyApiService>()
                .AddTransient<IOTPApiService, OTPApiService>()
                .AddHttpContextAccessor();
        }

        #region DbContext
        public static IServiceCollection AddDbContext(this IServiceCollection services, WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<EFDBContext>(options =>
            {
                if (Deployment.IsDevelopment())
                {
                    options.UseSqlServer(DatabaseConfig.UATDbConnectionString());
                }
                else
                {
                    options.UseSqlServer(DatabaseConfig.ProdDbConnectionString());
                }
            });
            return services;
        }
        #endregion
    }
}
