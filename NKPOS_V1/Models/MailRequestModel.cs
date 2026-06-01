namespace NKPOS_V1.Models
{
    public class MailRequestModel
    {
        public string? Name { get; set; }
        public string? PhoneNo { get; set; }
        public string? Email { get; set; }
        public string? ToMail { get; set; }
        public string? CCMail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public string? ProjectName { get; set; }
        public string? MailType { get; set; }
    }
}
