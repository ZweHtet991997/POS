

[Table("Tbl_Sales")]
public class Sale
{
    [Key]
    [Column("Sales_Id")]
    public int SalesId { get; set; }

    [Column("SaleNo")]
    [StringLength(50)]
    public string? SaleNo { get; set; }

    [Column("Business_Id")]
    public int? BusinessId { get; set; }

    [StringLength(50)]
    public string? CustomerName { get; set; }

    [StringLength(50)]
    public string? SaleMode { get; set; }

    [StringLength(50)]
    public string? SaleType { get; set; }

    [StringLength(50)]
    public string? PaymentType { get; set; }

    public bool? IsCredit { get; set; }

    [StringLength(50)]
    public string? DiscountType { get; set; }

    public int? DiscountValue { get; set; }
    public int? DiscountAmount { get; set; }
    public int? TaxPercentage { get; set; }
    public int? TaxAmount { get; set; }
    public int? SubTotal { get; set; }
    public int? GrandTotal { get; set; }
    public int? InitialAmount { get; set; }
    public int? PaidAmount { get; set; }
    public int? ChangeAmount { get; set; }

    [StringLength(500)]
    public string? Remark { get; set; }

    [StringLength(50)]
    public string? SaleDate { get; set; }

    public int? CreatedBy { get; set; }
}
