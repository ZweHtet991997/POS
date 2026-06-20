
[Table("Tbl_SaleItems")]
public class SaleItem
{
    [Key]
    [Column("SaleItems_Id")]
    public int SaleItemsId { get; set; }

    [Column("Sales_Id")]
    public int? SalesId { get; set; }

    [StringLength(50)]
    public string? ProductName { get; set; }

    [StringLength(50)]
    public string? WarehouseName { get; set; }

    public int? SaleQuantity { get; set; }

    public int? UnitPrice { get; set; }

    public int? DiscountPrice { get; set; }

    public int? TotalPrice { get; set; }

    [StringLength(50)]
    public string? CreatedDate { get; set; }

    [ForeignKey(nameof(SalesId))]
    public virtual Sale? Sale { get; set; }
}
