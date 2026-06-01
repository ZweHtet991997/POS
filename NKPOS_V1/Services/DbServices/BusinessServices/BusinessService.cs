namespace NKPOS_V1.Services.DbServices.BusinessServices
{
    public class BusinessService : IBusinessService
    {
        private readonly EFDBContext _context;

        public BusinessService(EFDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseModel> CreateBusinessAsync(BusinessModel model)
        {
            try
            {
                await _context.Businesses.AddAsync(model.ToEntity());
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<BusinessListResponseModel> GetAllBusinessesAsync()
        {
            BusinessListResponseModel responseModel = new BusinessListResponseModel();
            responseModel.DataLst = await _context.Businesses
                .Select(b => new BusinessModel
                {
                    BusinessId = b.BusinessId,
                    BusinessName = b.BusinessName
                })
                .ToListAsync();
            responseModel.baseResponseModel.RespCode = EnumStatusCode.Success;
            responseModel.baseResponseModel.RespMessage = ResponseMessageUtils.Success;
            return responseModel;
        }

        public async Task<BusinessModel> GetBusinessByIdAsync(int businessId)
        {
            return await _context.Businesses
                .Where(x => x.BusinessId == businessId)
                .Select(b => new BusinessModel
                {
                    BusinessId = b.BusinessId,
                    BusinessName = b.BusinessName
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ApiResponseModel> UpdateBusinessAsync(BusinessModel model)
        {
            try
            {
                var business = await _context.Businesses.FirstOrDefaultAsync(x => x.BusinessId == model.BusinessId);

                if (business == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.BusinessNotFound);
                }

                business.BusinessName = model.BusinessName;
                _context.Businesses.Update(business);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<ApiResponseModel> DeleteBusinessAsync(int businessId)
        {
            try
            {
                var business = await _context.Businesses.FirstOrDefaultAsync(x => x.BusinessId == businessId);

                if (business == null)
                {
                    return ResponseBuilder.CreateResponse(EnumStatusCode.NotFound, ResponseMessageUtils.BusinessNotFound);
                }

                _context.Businesses.Remove(business);
                await _context.SaveChangesAsync();

                return ResponseBuilder.CreateResponse(EnumStatusCode.Success, ResponseMessageUtils.Success);
            }
            catch (Exception ex)
            {
                return ResponseBuilder.CreateResponse(EnumStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
