namespace NKPOS_V1.Endpoints
{
    public class AdminAccessEndpoints
    {
        public static List<string> AdminEndPoinstList()
        {
            return new List<string>
            {
                "/api/v1/user-register",
                "/api/v1/business"
            };
        }
    }
}
