
namespace NKPOS_V1.Entities
{
    [Table("Tbl_User")]
    public class User
    {
        [Key]
        [Column("User_Id")]
        public int UserId { get; set; }

        [Column("Business_Id")]
        public int? Business_Id { get; set; }

        [Column("UserName")]
        [StringLength(50)]
        public string? UserName { get; set; }

        [Column("Email")]
        [StringLength(50)]
        public string? Email { get; set; }

        [Column("PhoneNumber")]
        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [Column("Password")]
        [StringLength(250)]
        public string? Password { get; set; }

        [Column("Role")]
        [StringLength(50)]
        public string? Role { get; set; }

        [Column("Company")]
        public int? Company { get; set; }

        [Column("IsActive")]
        public bool? IsActive { get; set; }

        [Column("CreatedDate")]
        [StringLength(50)]
        public string? CreatedDate { get; set; }
    }
}
