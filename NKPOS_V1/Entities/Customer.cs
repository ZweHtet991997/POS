namespace NKPOS_V1.Entities
{
    [Table("Tbl_Customer")]
    public class Customer
    {
        [Key]
        [Column("Customer_Id")]
        public int CustomerId { get; set; }

        [Column("CustomerName")]
        [StringLength(50)]
        public string? CustomerName { get; set; }

        [Column("PhoneNumber")]
        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [Column("Address")]
        [StringLength(50)]
        public string? Address { get; set; }

        [Column("CreatedDate")]
        [StringLength(50)]
        public string? CreatedDate { get; set; }

        [Column("CreatedBy")]
        public int? CreatedBy { get; set; }

        [Column("UpdatedDate")]
        [StringLength(50)]
        public string? UpdatedDate { get; set; }

        [Column("UpdatedBy")]
        public int? UpdatedBy { get; set; }
    }
}
