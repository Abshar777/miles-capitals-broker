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
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface DataTableProps {
  columns: any;
  data: any;
  totalRows?: number;
  search?: any;
  pageCount?: number;
  component?: React.ReactNode;
  hasNextPage?: boolean;
  isColNeeded?: boolean;
  emptyText?: string;
}

/**
 * Server-paginated table in the reference style: filters row (48px fields), 12px grey header,
 * 61px rows, footer with 40px page buttons on the left and "Rows N" on the right.
 * Pagination and search are mirrored to the URL (skip / limit / search).
 */
export function DataTable({
  columns,
  data,
  totalRows,
  search: searchProps,
  pageCount: serverPageCount,
  component = <></>,
  isColNeeded = true,
  hasNextPage,
  emptyText = "No items to show",
}: DataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSkip = Number(searchParams.get("skip")) || 0;
  const initialLimit = Number(searchParams.get("limit")) || 10;
  const initialSearch = searchParams.get("search") || "";
  const initialField = searchParams.get("searchField") || "all";

  const [searchField] = React.useState<string>(initialField);
  const [searchValue, setSearchValue] = React.useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = React.useState(initialSearch);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: Math.floor(initialSkip / initialLimit),
    pageSize: initialLimit,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue), 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const updateURL = useCallback(
    (updates: { skip?: number; limit?: number; search?: string; searchField?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.skip !== undefined) {
        updates.skip === 0 ? params.delete("skip") : params.set("skip", updates.skip.toString());
      }
      if (updates.limit !== undefined) {
        updates.limit === 10 ? params.delete("limit") : params.set("limit", updates.limit.toString());
      }
      if (updates.search !== undefined) {
        updates.search === "" ? params.delete("search") : params.set("search", updates.search);
      }
      if (updates.searchField !== undefined) {
        updates.searchField === "all"
          ? params.delete("searchField")
          : params.set("searchField", updates.searchField);
      }
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    updateURL({ search: debouncedSearch, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    updateURL({ searchField, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchField]);

  useEffect(() => {
    const skip = pagination.pageIndex * pagination.pageSize;
    updateURL({ skip, limit: pagination.pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const skipFromUrl = Number(searchParams.get("skip")) || 0;
    const limitFromUrl = Number(searchParams.get("limit")) || 10;
    setPagination({
      pageIndex: Math.floor(skipFromUrl / limitFromUrl),
      pageSize: limitFromUrl,
    });
  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    pageCount: serverPageCount ?? (totalRows ? Math.ceil(totalRows / pagination.pageSize) : -1),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    rowCount: totalRows ?? -1,
  });

  const pageIndex = pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pages = React.useMemo(() => {
    const total = pageCount > 0 ? pageCount : pageIndex + (hasNextPage ? 2 : 1);
    const start = Math.max(0, Math.min(pageIndex - 2, total - 5));
    return Array.from({ length: Math.min(5, total) }, (_, i) => start + i);
  }, [pageCount, pageIndex, hasNextPage]);

  const canNext = hasNextPage !== undefined ? hasNextPage : table.getCanNextPage();
  const pageBtn =
    "size-10 inline-flex items-center justify-center rounded-[4px] text-[15px] leading-6 transition-colors disabled:opacity-40";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 [&_[data-slot=select-trigger]]:h-12 [&_[data-slot=select-trigger]]:data-[size=default]:h-12 [&_[data-slot=select-trigger]]:md:w-[184px] [&_[data-slot=input]]:h-12">
        {searchProps && (
          <div className="relative w-full md:w-[184px]">
            <Icon name="search-16" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-12 w-full rounded-[4px] border border-field bg-field pl-10 pr-4 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-primary/60"
            />
          </div>
        )}
        {component}
        {isColNeeded && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="md:ml-auto h-12 inline-flex items-center justify-center gap-2 rounded-[4px] bg-field px-4 text-[15px] text-foreground"
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
        )}
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
            disabled={!canNext}
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
                  onSelect={() => setPagination({ pageIndex: 0, pageSize: n })}
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
