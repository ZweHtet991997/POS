namespace NKPOS_V1.Config
{
    public class DatabaseConfig
    {
        private const string UATServer = "SQL8010.site4now.net";
        private const string UATDatabase = "db_a9a6b3_nkpos";
        private const string UATUserId = "db_a9a6b3_nkpos_admin";
        private const string UATPassword = "NKsoftwarehouse*11";

        private const string ProdServer = "SQL8011.site4now.net";
        private const string ProdDatabase = "db_a9a6b3_promanager";
        private const string ProdUserId = "db_a9a6b3_promanager_admin";
        private const string ProdPassword = "NKsoftwarehouse*11";

        public static string UATDbConnectionString()
        {
            return $"Data Source={UATServer};Initial Catalog={UATDatabase};User Id={UATUserId};Password={UATPassword};TrustServerCertificate=True";
        }
        public static string ProdDbConnectionString()
        {
            return $"Data Source={ProdServer};Initial Catalog={ProdDatabase};User Id={ProdUserId};Password={ProdPassword};TrustServerCertificate=True";
        }
    }
}
