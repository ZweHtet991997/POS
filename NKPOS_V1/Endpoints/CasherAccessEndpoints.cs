namespace NKPOS_V1.Endpoints
{
    public class CasherAccessEndpoints
    {
        public static List<string> CasherEndPoinstList()
        {
            return new List<string>
            {
                "/api/v1/login",
                "/api/v1/sale",
                "/api/v1/sale/detail"
            };
        }
    }
}
