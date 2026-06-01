

namespace NKPOS_V1.Entities
{
    [Table("Tbl_Product")]
    public class Product
    {
        [Key]
        [Column("Product_Id")]
        public int ProductId { get; set; }

        [Column("Category_Id")]
        public int? CategoryId { get; set; }

        [Column("SubCategory_Id")]
        public int? SubCategoryId { get; set; }

        [Column("Business_Id")]
        public int? BusinessId { get; set; }

        [Column("ProductName")]
        [StringLength(250)]
        public string? ProductName { get; set; }

        [Column("Description")]
        [StringLength(500)]
        public string? Description { get; set; }

        [Column("UnitPrice")]
        public int? UnitPrice { get; set; }

        [Column("RetailPrice")]
        public int? RetailPrice { get; set; }

        [Column("WholeSalePrice")]
        public int? WholeSalePrice { get; set; }

        [Column("ImagePath")]
        public string? ImagePath { get; set; }

        [Column("CreatedDate")]
        [StringLength(50)]
        public string? CreatedDate { get; set; }

        [Column("UpdatedDate")]
        [StringLength(50)]
        public string? UpdatedDate { get; set; }

        [Column("CreatedBy")]
        public int? CreatedBy { get; set; }

        [Column("UpdatedBy")]
        public int? UpdatedBy { get; set; }

        [Column("IsActive")]
        public bool? IsActive { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public Category? Category { get; set; }
    }
}
