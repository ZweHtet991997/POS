namespace NKPOS_V1.Entities
{
    [Table("Tbl_Company")]
    public class CompanyEntity
    {
        [Key]
        [Column("Company_Id")]
        public int CompanyId { get; set; }
        [Column("CompanyName")]
        public string CompanyName { get; set; }
        [Column("CreatedDate")]
        public string CreatedDate { get; set; }
    }
}
