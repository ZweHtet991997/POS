namespace NKPOS_V1.Config
{
    public static class JWTConfig
    {
        //UAT Jwt Config
        public static string UATJWTKey = "Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kqw5R2Nmf4FWs03Uat";
        public static string UATIssuer = "JWTAuthenticationUATServer";
        public static string UATAudience = "JWTServicePostmanUATClient";
        public static string UATSubject = "JWTUATServiceAccessToken";

        //PROD Jwt Config
        public static string JWTKey = "Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kqw5R2Nmf4FWs03Hdx";
        public static string Issuer = "JWTAuthenticationServer";
        public static string Audience = "JWTServicePostmanClient";
        public static string Subject = "JWTServiceAccessToken";
    }
}
