namespace NKPOS_V1.Entities
{
    [Table("Tbl_Business")]
    public class Business
    {
        [Key]
        [Column("Business_Id")]
        public int BusinessId { get; set; }

        [Column("BusinessName")]
        [StringLength(250)]
        public string? BusinessName { get; set; }

        [Column("CreatedDate")]
        [StringLength(50)]
        public string? CreatedDate { get; set; }

        [Column("UpdatedDate")]
        [StringLength(50)]
        public string? UpdatedDate { get; set; }
    }
}
