namespace NKPOS_V1.Utils
{
    public static class ResponseMessageUtils
    {
        public const string Success = "Success";
        public const string LoginSuccess = "Login Successful";
        public const string Error = "Inernal Server Error";
        public const string BadRequest = "Bad Request";
        public const string FailedToRegister = "Failed to Register.Please try again";
        public const string LoginFailed = "Invalid Email or Password.Please try again";
        public const string RequestOTPSuccess = "OTP Send Successfully.Please check your inbox";
        public const string RequiredPhoneNumber = "Phone number is required";
        public const string UnAuthorizeAccessEndpoint = "You are not unauthorized to access this endpoint";
        public const string InvalidToken = "Invalid token or token must not be null";
        public const string BusinessNameRequired = "Required Business Name";
        public const string BusinessIdRequired = "Required Business ID";
        public const string InvalidPhoneNumber = "Invalid Phone Number";

        public const string BusinessNotFound = "Business not found.";
        public const string FileNotFound = "File not found.";
        public const string CategoryNotFound = "No category data found.";
        public const string UserNotFound = "User not found.";
        public const string RequiredUserId = "User Id Required";
        public const string SubCategoryNotFound = "No sub category data found.";
        public const string FailedToCreateDirectory = "public constFailed to Create Directory";
        public const string InvalidFile = "Invalid File";
        public const string DeleteFileFailed = "Failed to delete existing file.Please try again";
        public const string FileUploadFailed = "Failed to upload Product Image.Please try again";
        public const string FileRequired = "Required file to upload";
        public const string PathRequired = "Invalid File path or File Path missing.";
        public const string CannotCreateSameLevelUser = "You cannot create same user role.Please contact your administartor.";
        public const string CannotDeleteCategory = "You cannot delete this category because it is already mapped with existing products.";
        public const string CannotDeleteCategoryWihtSubCategory = "You cannot delete this category because it is already mapped with subcategory.";
        public const string CannotDeleteSubCategory = "You cannot delete this sub-category because it is already mapped with existing products.";
        public static string DuplicateCategory(string categoryName)
        {
            return $"Category Name {categoryName} already exists. Please choose a different name.";
        }

        public static string DuplicateSubCategory(string subCategoryName)
        {
            return $"sub Category Name {subCategoryName} already exists. Please choose a different name.";
        }

        public static string EmailAlreadyExist(string email)
        {
            return $"Your email {email} is already registered in the system";
        }

        public static string DuplicateCustomerName(string customerName)
        {
            return $"Customer Name {customerName} already exists. Please choose a different name.";
        }

        public static string PhoneNoAlreadyExist(string phoneNo)
        {
            return $"Your Phone Number {phoneNo} is already registered in the system";
        }
    }
}
