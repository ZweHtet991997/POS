
namespace NKPOS_V1.Models
{
    public class ApiResponseModel
    {
        public BaseResponseModel baseResponseModel { get; set; } = new BaseResponseModel();
    }

    public class BaseResponseModel
    {
        public EnumStatusCode RespCode { get; set; }
        public string RespMessage { get; set; } = null!;
    }
}
