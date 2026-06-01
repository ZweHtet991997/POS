

namespace NKPOS_V1.BusinessLogic.BusinessBusinessLogic
{
    public class BusinessBL : IBusinessBL
    {
        private readonly IBusinessService _businessService;

        public BusinessBL(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        public async Task<ApiResponseModel> CreateBusinessAsync(BusinessModel model)
        {
            var validation = ValidateCreate(model);
            if (validation != null) return validation;
            return await _businessService.CreateBusinessAsync(model);
        }

        public async Task<BusinessListResponseModel> GetAllBusinessesAsync()
        {
            return await _businessService.GetAllBusinessesAsync();
        }

        public async Task<BusinessModel> GetBusinessByIdAsync(int businessId)
        {
            return await _businessService.GetBusinessByIdAsync(businessId);
        }

        public async Task<ApiResponseModel> UpdateBusinessAsync(BusinessModel model)
        {
            var validation = ValidateUpdate(model);
            if (validation != null) return validation;
            return await _businessService.UpdateBusinessAsync(model);
        }

        public async Task<ApiResponseModel> DeleteBusinessAsync(int businessId)
        {
            if (businessId <= 0) return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            return await _businessService.DeleteBusinessAsync(businessId);
        }

        private ApiResponseModel? ValidateCreate(BusinessModel? model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.BusinessName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BusinessNameRequired);
            }

            return null;
        }

        private ApiResponseModel? ValidateUpdate(BusinessModel? model)
        {
            if (string.IsNullOrWhiteSpace(model.BusinessName))
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.BadRequest, ResponseMessageUtils.BadRequest);
            }

            return null;
        }
    }
}