"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import Button from "../button";
import Dropdown from "../dropdown";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

/* =========================
   Types & Context
========================= */

type RowKey = string | number;

type TableContextType = {
  selectable: boolean;
  selectedRows: Set<RowKey>;
  toggleRow: (id: RowKey) => void;
  toggleAll: (ids: RowKey[]) => void;
  isSelected: (id: RowKey) => boolean;
  isAllSelected: (ids: RowKey[]) => boolean;
};

const TableContext = createContext<TableContextType | null>(null);

const useTable = () => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("Table components must be used inside <Table>");
  return ctx;
};

/* =========================
   Table
========================= */

export const Table: React.FC<
  React.PropsWithChildren<{
    selectable?: boolean;
    selectedRowKeys?: RowKey[];
    onSelectionChange?: (keys: RowKey[]) => void;
    filterable?: boolean;
    onFilter?: (query: string) => void;
    pageSize?: number;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
    removeWrapper?: boolean;
    className?: string;
    "aria-label"?: string;
  }>
> = ({
  children,
  selectable = false,
  selectedRowKeys,
  onSelectionChange,
  filterable,
  onFilter,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  onPageSizeChange,
  removeWrapper,
  className,
  "aria-label": ariaLabel,
}) => {
    const [query, setQuery] = useState("");
    const [internalSelection, setInternalSelection] = useState<Set<RowKey>>(
      new Set()
    );

    const selectedRows = useMemo(
      () => (selectedRowKeys ? new Set(selectedRowKeys) : internalSelection),
      [selectedRowKeys, internalSelection]
    );

    const toggleRow = (id: RowKey) => {
      const next = new Set(selectedRows);
      next.has(id) ? next.delete(id) : next.add(id);

      if (!selectedRowKeys) setInternalSelection(next);
      onSelectionChange?.([...next]);
    };

    const toggleAll = (ids: RowKey[]) => {
      const allSelected = ids.every(id => selectedRows.has(id));
      const next = new Set<RowKey>(allSelected ? [] : ids);

      if (!selectedRowKeys) setInternalSelection(next);
      onSelectionChange?.([...next]);
    };

    const value: TableContextType = {
      selectable,
      selectedRows,
      toggleRow,
      toggleAll,
      isSelected: id => selectedRows.has(id),
      isAllSelected: ids =>
        ids.length > 0 && ids.every(id => selectedRows.has(id)),
    };

    const table = (
      <table
        aria-label={ariaLabel}
        className={`min-w-full ${className || ""}`}
      >
        {children}
      </table>
    );

    return (
      <TableContext.Provider value={value}>
        <div className="space-y-3">
          {(filterable || onPageSizeChange) && (
            <div className="flex justify-between gap-4">
              {filterable && (
                <input
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    onFilter?.(e.target.value);
                  }}
                  placeholder="Filter..."
                  className="border border-(--border-default) focus:outline-none focus:ring-2 focus:ring-(--primary) rounded px-3 py-2 w-full max-w-xs"
                />
              )}

              {onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Rows per page:-</p>
                  <Dropdown
                    value={Number(pageSize)}
                    options={pageSizeOptions}
                    onChange={onPageSizeChange}
                  />
                </div>
              )}
            </div>
          )}

          {removeWrapper ? table : <div className="overflow-x-auto">{table}</div>}
        </div>
      </TableContext.Provider>
    );
  };

/* =========================
   Head / Body
========================= */

export const TableHeader: React.FC<React.PropsWithChildren> = ({
  children,
}) => <thead className="bg-(--border-default)">{children}</thead>;

export const TableBody: React.FC<React.PropsWithChildren> = ({
  children,
}) => <tbody className="[&>tr:last-child]:border-b-0">{children}</tbody>;

/* =========================
   Row
========================= */

export const TableRow: React.FC<
  React.PropsWithChildren<{ rowId?: RowKey; className?: string }>
> = ({ children, rowId, className }) => {
  const table = useTable();
  const selected =
    table.selectable && rowId !== undefined && table.isSelected(rowId);

  return (
    <tr
      onClick={() =>
        table.selectable && rowId !== undefined && table.toggleRow(rowId)
      }
      className={`
        border-b border-(--border-default)
        ${table.selectable ? "cursor-pointer" : ""}
        ${selected ? "bg-(--primary-soft)" : "hover:bg-gray-50"}
        ${className || ""}
      `}
    >
      {children}
    </tr>
  );
};

/* =========================
   Columns & Cells
========================= */

export const TableColumn: React.FC<{
  checkbox?: boolean;
  rowIds?: RowKey[];
  className?: string;
  children?: React.ReactNode;
}> = ({ checkbox, rowIds = [], children, className }) => {
  const table = useTable();

  if (checkbox && table.selectable) {
    return (
      <th className="p-3 w-10">
        <input
          type="checkbox"
          checked={table.isAllSelected(rowIds)}
          onChange={() => table.toggleAll(rowIds)}
        />
      </th>
    );
  }

  return (
    <th className={`p-3 text-left font-semibold ${className || ""}`}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<
  React.PropsWithChildren<{ rowId?: RowKey; checkbox?: boolean }>
> = ({ children, rowId, checkbox }) => {
  const table = useTable();

  if (checkbox && table.selectable && rowId !== undefined) {
    return (
      <td className="p-3 w-10">
        <input
          type="checkbox"
          checked={table.isSelected(rowId)}
          onChange={() => table.toggleRow(rowId)}
          onClick={e => e.stopPropagation()}
        />
      </td>
    );
  }

  return <td className={"p-3"}>{children}</td>;
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
}> = ({ page, totalPages, onPageChange, startIndex, endIndex, totalItems ,itemLabel }) => (
  <div className="flex items-center justify-between bg-(--border-default) py-2 px-4">
    <div className="hidden md:block">
      <p className="text-sm">Showing <b>{startIndex}</b> to <b>{endIndex}</b> of <b>{totalItems}</b> {itemLabel}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3!"
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
      >
        <RiArrowRightSLine />
      </Button>
    </div>
  </div>
);