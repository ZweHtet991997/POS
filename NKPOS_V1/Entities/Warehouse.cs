
namespace NKPOS_V1.Entities
{
    [Table("Tbl_Warehouse")]
    public class Warehouse
    {
        [Key]
        [Column("Warehouse_Id")]
        public int WarehouseId { get; set; }

        [Column("WarehouseName")]
        [StringLength(250)]
        public string? WarehouseName { get; set; }

        [Column("WarehouseAddress")]
        [StringLength(500)]
        public string? WarehouseAddress { get; set; }

        [Column("ManagerName")]
        [StringLength(50)]
        public string? ManagerName { get; set; }

        [Column("PhoneNumber")]
        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [Column("Description")]
        [StringLength(500)]
        public string? Description { get; set; }

        [Column("LastUpdatedDate")]
        [StringLength(50)]
        public string? LastUpdatedDate { get; set; }

        [Column("IsActive")]
        public bool? IsActive { get; set; }
    }
}
