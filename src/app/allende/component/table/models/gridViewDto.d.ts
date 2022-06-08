declare interface GridViewDto<T> {
	Columns?: any[];
	Rows?: T[];
	UsePagination?: boolean;
	CurrentPage?: number;
	RowCount?: number;
	PageSize?: number;
	TotalPage?: number;
	SortColumns?:any;
	ShowRowCount?: boolean;
	ShowPageSize?: boolean;
	ShowColumnsFilter?: boolean;
	ExportToExcelEnabled?: boolean;
}