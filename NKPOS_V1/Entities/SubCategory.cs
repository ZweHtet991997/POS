namespace NKPOS_V1.Entities
{
    [Table("Tbl_SubCategory")]
    public class SubCategory
    {
        [Key]
        [Column("SubCategory_Id")]
        public int SubCategoryId { get; set; }

        [Column("Category_Id")]
        public int? CategoryId { get; set; }

        [Column("SubCategoryName")]
        [StringLength(250)]
        public string? SubCategoryName { get; set; }

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

        [ForeignKey(nameof(CategoryId))]
        public Category? Category { get; set; }
    }
}
