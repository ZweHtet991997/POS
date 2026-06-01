namespace NKPOS_V1.Helpers
{
    public static class ResponseBuilder
    {
        public static ApiResponseModel CreateResponse(EnumStatusCode statusCode, string message)
        {
            return new ApiResponseModel
            {
                baseResponseModel = new BaseResponseModel
                {
                    RespCode = statusCode,
                    RespMessage = message
                }
            };
        }
    }
}
