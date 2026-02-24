"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import Button from "../button";
import { RiArrowLeftSLine, RiArrowRightSLine, RiLoader5Line } from "react-icons/ri";
import Dropdown from "../dropdown";

// Table Context
type RowKey = string | number;

type TableContextType = {
  selectable: boolean;
  selectedRows: Set<RowKey>;
  toggleRow: (id: RowKey) => void;
  isSelected: (id: RowKey) => boolean;
  toggleAll: (ids: RowKey[]) => void;
  isAllSelected: (ids: RowKey[]) => boolean;
};

const TableContext = createContext<TableContextType | null>(null);

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used inside <Table>");
  }
  return context;
};

// Main Table
export const Table: React.FC<
  React.PropsWithChildren<{
    shadow?: string;
    filterable?: boolean;
    onFilter?: (query: string) => void;
    pageSizeOptions?: number[];
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    removeWrapper?: boolean;
    selectable?: boolean;
    selectedRowKeys?: RowKey[];
    onSelectionChange?: (keys: RowKey[]) => void;
    "aria-label"?: string;
    className?: string;
  }>
> = ({
  children,
  filterable = false,
  onFilter,
  pageSizeOptions = [5, 10, 20, 50],
  pageSize,
  onPageSizeChange,
  removeWrapper = false,
  selectable = false,
  selectedRowKeys,
  onSelectionChange,
  "aria-label": ariaLabel,
  className,
}) => {
    const [query, setQuery] = useState("");

    const [internalSelection, setInternalSelection] = useState<Set<RowKey>>(
      new Set()
    );

    const selectedRows = useMemo(() => {
      return selectedRowKeys
        ? new Set(selectedRowKeys)
        : internalSelection;
    }, [selectedRowKeys, internalSelection]);

    const toggleRow = (id: RowKey) => {
      const next = new Set(selectedRows);
      next.has(id) ? next.delete(id) : next.add(id);

      if (!selectedRowKeys) {
        setInternalSelection(next);
      }
      onSelectionChange?.([...next]);
    };

    const handleFilterChange = (value: string) => {
      setQuery(value);
      onFilter?.(value);
    };

    const toggleAll = (ids: RowKey[]) => {
      const allSelected = ids.every((id) => selectedRows.has(id));
      const next = new Set<RowKey>(allSelected ? [] : ids);

      if (!selectedRowKeys) setInternalSelection(next);
      onSelectionChange?.([...next]);
    };

    const isAllSelected = (ids: RowKey[]) =>
      ids.length > 0 && ids.every((id) => selectedRows.has(id));


    return (
      <TableContext.Provider
        value={{
          selectable,
          selectedRows,
          toggleRow,
          isSelected: (id) => selectedRows.has(id),
          toggleAll,
          isAllSelected,
        }}
      >
        <div className="space-y-3">
          {/* Top controls */}
          {(filterable || onPageSizeChange) && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {filterable && (
                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    handleFilterChange(e.target.value)
                  }
                  placeholder="Filter..."
                  className="border bg-(--card) border-(--border-default) rounded px-3 py-2 w-full md:w-64 focus:outline-(--primary)"
                  disabled={!onFilter}
                />
              )}

              {onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <Dropdown
                    value={Number(pageSize)}
                    onChange={onPageSizeChange}
                    options={pageSizeOptions}
                  />
                </div>
              )}
            </div>
          )}

          {/* Table */}
          {removeWrapper ? (
            <table
              aria-label={ariaLabel}
              className={`min-w-full ${className || ""}`}
            >
              {children}
            </table>
          ) : (
            <div className="overflow-x-auto">
              <table
                aria-label={ariaLabel}
                className={`min-w-full ${className || ""}`}
              >
                {children}
              </table>
            </div>
          )}
        </div>
      </TableContext.Provider>
    );
  };

/* =========================
   Table Header & Body
========================= */

export const TableHeader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  useTable();
  return <thead className="bg-(--border-default)">{children}</thead>;
};


export const TableBody: React.FC<
  React.PropsWithChildren<{
    isLoading?: boolean;
    emptyContent?: React.ReactNode;
  }>
> = ({ children, isLoading, emptyContent }) => {
  useTable();

  if (isLoading) {
    return (
      <tbody>
        <TableRow>
          <TableCell colSpan={100} className="text-center py-4">
            <div className="flex justify-center items-center w-full py-16 bg-(--card)">
              <RiLoader5Line
                size={48}
                className="animate-spin text-(--primary)"
              />
            </div>
          </TableCell>
        </TableRow>
      </tbody>
    );
  }

  if (!children) {
    return <tbody>{emptyContent}</tbody>;
  }

  return <tbody>{children}</tbody>;
};

/* =========================
   Table Row
========================= */

export const TableRow: React.FC<
  React.PropsWithChildren<{
    rowId?: string | number;
    className?: string;
  }>
> = ({ children, rowId, className }) => {
  const table = useTable();

  const selectable = table.selectable && rowId !== undefined;
  const selected = selectable && table.isSelected(rowId);

  return (
    <tr
      onClick={() => selectable && table.toggleRow(rowId!)}
      className={`
        border-b border-b-(--border-default)
        ${selectable ? "cursor-pointer" : ""}
        ${selected ? "bg-(--secondary-accent)" : "hover:bg-(--primary-soft)"}
        ${className || ""}
      `}
    >
      {table.selectable && (
        <td className="p-3 w-10">
          <input type="checkbox" checked={selected} readOnly />
        </td>
      )}
      {children}
    </tr>
  );
};


/* =========================
   Table Cells
========================= */

export const TableColumn: React.FC<
  React.PropsWithChildren<{ className?: string; checkbox?: boolean }>
> = ({ children, className, checkbox }) => {
  const table = useTable();

  if (checkbox && table.selectable) {
    return (
      <th className="p-3 w-10">
        <input type="checkbox" />
      </th>
    );
  }

  return (
    <th className={`p-3 text-left font-bold ${className || ""}`}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<
  React.PropsWithChildren<{ className?: string; colSpan?: number }>
> = ({ children, className, colSpan }) => {
  useTable();
  return (
    <td colSpan={colSpan} className={`p-3 ${className || ""}`}>
      {children}
    </td>
  );
};

/* =========================
   Pagination
========================= */

export const TablePagination: React.FC<{
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}> = ({ page, totalPages, onPageChange, startIndex, endIndex, totalItems, itemLabel }) => (
  <div className="flex items-center justify-between bg-(--border-default) py-2 px-4">
    <div className="hidden md:block">
      <p className="text-sm">Showing <b>{startIndex}</b> to <b>{endIndex}</b> of <b>{totalItems}</b> {itemLabel}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3!"
        primary
      >
        <RiArrowLeftSLine />
      </Button>

      <span>
        Page {page} of {totalPages}
      </span>

      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3!"
        primary
      >
        <RiArrowRightSLine />
      </Button>
    </div>
  </div>
);