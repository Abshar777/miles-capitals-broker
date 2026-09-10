"use client";
import { Icon } from "@/components/ui/icon";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Reference table: 48px search field + column picker on top, 12px grey header,
 * 61px rows, pagination footer with 40px page buttons on the left and "Rows N" on the right.
 */
export function DataTable({
  columns,
  data,
  search: searchProps,
  emptyText = "No items to show",
}: {
  columns: any;
  data: any;
  search?: any;
  emptyText?: string;
}) {
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const filteredData = React.useMemo(() => {
    if (!searchValue.trim()) return data;
    const q = searchValue.toLowerCase();
    return (data || []).filter((row: any) =>
      Object.values(row).some((val) => String(val ?? "").toLowerCase().includes(q))
    );
  }, [data, searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pages = React.useMemo(() => {
    const total = Math.max(pageCount, 1);
    const start = Math.max(0, Math.min(pageIndex - 2, total - 5));
    return Array.from({ length: Math.min(5, total) }, (_, i) => start + i);
  }, [pageCount, pageIndex]);

  const pageBtn =
    "size-10 inline-flex items-center justify-center rounded-[4px] text-[15px] leading-6 transition-colors disabled:opacity-40";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-[248px]">
          <Icon name="search-16" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-12 w-full rounded-[4px] border border-field bg-field pl-10 pr-4 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-primary/60"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-auto h-12 inline-flex items-center gap-2 rounded-[4px] bg-field px-4 text-[15px] text-foreground"
            >
              Columns <Icon name="dropdown-16" size={16} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border rounded-[4px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  className="capitalize cursor-pointer rounded-[4px] focus:bg-field gap-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    column.toggleVisibility(!column.getIsVisible());
                  }}
                >
                  <span
                    className={cn(
                      "size-4 rounded-[4px] border border-muted-foreground inline-flex items-center justify-center",
                      column.getIsVisible() && "bg-primary border-primary"
                    )}
                  />
                  {column.id}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="h-12">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-start">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-[240px] text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground">
                    <Icon name="no-data-16" size={16} />
                  </span>
                  <span className="text-[18px] leading-6 font-medium text-foreground">{emptyText}</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className={cn(pageBtn, "text-muted-foreground hover:text-foreground")}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <Icon name="chevron-left-16" size={16} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => table.setPageIndex(p)}
              className={cn(
                pageBtn,
                "px-1",
                p === pageIndex
                  ? "text-foreground border-b-2 border-primary rounded-none"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p + 1}
            </button>
          ))}
          <button
            type="button"
            className={cn(pageBtn, "text-muted-foreground hover:text-foreground")}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <Icon name="chevron-right-16" size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[15px] leading-6 text-muted-foreground">
          Rows
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="inline-flex items-center gap-1 text-foreground">
                {pagination.pageSize}
                <Icon name="dropdown-16" size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border rounded-[4px] min-w-16">
              {[10, 20, 30, 50].map((n) => (
                <DropdownMenuItem
                  key={n}
                  className="cursor-pointer rounded-[4px] focus:bg-field"
                  onSelect={() => setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: n }))}
                >
                  {n}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
