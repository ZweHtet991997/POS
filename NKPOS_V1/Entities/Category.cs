
namespace NKPOS_V1.Entities
{
    [Table("Tbl_Category")]
    public class Category
    {
        [Key]
        [Column("Category_Id")]
        public int CategoryId { get; set; }

        [Column("CategoryName")]
        [StringLength(250)]
        public string? CategoryName { get; set; }

        [Column("Description")]
        [StringLength(500)]
        public string? Description { get; set; }

        [Column("IsActive")]
        public bool? IsActive { get; set; }

        [Column("CreatedDate")]
        [StringLength(50)]
        public string? CreatedDate { get; set; }

        [Column("UpdatedDate")]
        [StringLength(50)]
        public string? UpdatedDate { get; set; }
    }
}
