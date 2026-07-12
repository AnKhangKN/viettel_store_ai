import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  Info
} from "lucide-react";

/**
 * TableComponent - Component bảng dữ liệu dùng chung cao cấp
 * 
 * @param {Array} data - Mảng dữ liệu chứa các dòng (objects)
 * @param {Array} columns - Mảng cấu hình cột:
 *    - header: Tiêu đề cột (string)
 *    - accessor: Trường lấy dữ liệu (string)
 *    - render: Hàm vẽ custom ô (function(row))
 *    - sortable: Có thể sắp xếp hay không (boolean)
 * @param {string} searchPlaceholder - Gợi ý trong ô tìm kiếm
 * @param {Array} searchFields - Các trường dữ liệu sẽ quét qua khi tìm kiếm
 * @param {Array} filterConfigs - Cấu hình bộ lọc dropdown:
 *    - field: Trường dữ liệu cần lọc (string)
 *    - label: Tiêu đề bộ lọc (string)
 *    - options: Lựa chọn [{ label, value }]
 * @param {number} defaultItemsPerPage - Số dòng mặc định trên trang
 */
const TableComponent = ({
  data = [],
  columns = [],
  searchPlaceholder = "Tìm kiếm thông tin...",
  searchFields = [],
  filterConfigs = [],
  defaultItemsPerPage = 10
}) => {
  // State quản lý tìm kiếm, lọc, sắp xếp, phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Reset trang về 1 khi lọc hoặc tìm kiếm thay đổi
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  // Logic Sắp xếp
  const handleSort = (accessor, sortable) => {
    if (!sortable) return;
    let direction = "asc";
    if (sortConfig.key === accessor && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: accessor, direction });
  };

  // Xử lý Lọc & Tìm kiếm dữ liệu
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Thực hiện lọc theo các dropdown
    Object.keys(selectedFilters).forEach((field) => {
      const filterValue = selectedFilters[field];
      if (filterValue && filterValue !== "") {
        result = result.filter((row) => {
          const cellValue = row[field];
          return String(cellValue) === String(filterValue);
        });
      }
    });

    // 2. Thực hiện tìm kiếm toàn văn
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((row) => {
        // Nếu không truyền searchFields thì quét qua tất cả các cột hiển thị
        const fieldsToSearch = searchFields.length > 0
          ? searchFields
          : columns.map((col) => col.accessor).filter(Boolean);

        return fieldsToSearch.some((field) => {
          const value = row[field];
          return value && String(value).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // 3. Thực hiện sắp xếp
    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const valA = a[key] !== undefined ? a[key] : "";
        const valB = b[key] !== undefined ? b[key] : "";

        if (typeof valA === "number" && typeof valB === "number") {
          return direction === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return direction === "asc" ? -1 : 1;
        if (strA > strB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, selectedFilters, searchTerm, searchFields, columns, sortConfig]);

  // Phân trang
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Giới hạn trang hiện tại không vượt quá tổng số trang
  const activePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, activePage, itemsPerPage]);

  // Tính chỉ số hiển thị dòng
  const startIndex = totalItems === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(activePage * itemsPerPage, totalItems);

  // Tạo mảng hiển thị các số trang (rút gọn)
  const paginationRange = useMemo(() => {
    const range = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị cùng một lúc

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      let start = Math.max(1, activePage - 2);
      let end = Math.min(totalPages, activePage + 2);

      if (start === 1) {
        end = maxVisiblePages;
      } else if (end === totalPages) {
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) range.push(i);
    }
    return range;
  }, [totalPages, activePage]);

  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden w-full transition-all">
      {/* Control Bar (Search & Filters) */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
        {/* Left: Search & Items per page */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] transition-all text-gray-800 placeholder:text-gray-400 shadow-inner"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer text-gray-700 font-bold"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} dòng
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Custom filter dropdowns */}
        {filterConfigs.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc theo:
            </span>
            {filterConfigs.map((config) => (
              <select
                key={config.field}
                value={selectedFilters[config.field] || ""}
                onChange={(e) => handleFilterChange(config.field, e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#EE0033] cursor-pointer text-gray-700 font-semibold shadow-sm"
              >
                <option value="">Tất cả {config.label}</option>
                {config.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 bg-gray-50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(col.accessor, col.sortable)}
                  className={`p-4 font-bold text-gray-700 text-sm whitespace-nowrap select-none transition-colors ${
                    col.sortable ? "cursor-pointer hover:bg-gray-100 hover:text-gray-900" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortConfig.key === col.accessor ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-[#EE0033]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#EE0033]" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-red-50/10 transition-colors duration-150 group"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-4 text-sm text-gray-800 font-medium">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 text-gray-300" />
                    <p className="font-semibold text-gray-500">Không tìm thấy bản ghi nào khớp</p>
                    <p className="text-xs text-gray-400">Hãy thử nhập từ khóa khác hoặc điều chỉnh bộ lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer (Pagination & Statistics) */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Summary Stats */}
        <div className="text-xs text-gray-500 font-medium text-center sm:text-left">
          Hiển thị <span className="font-bold text-gray-800">{startIndex}</span> -{" "}
          <span className="font-bold text-gray-800">{endIndex}</span> trong tổng số{" "}
          <span className="font-bold text-gray-800">{totalItems}</span> bản ghi
        </div>

        {/* Right: Pagination Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 self-center">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Trang đầu"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {paginationRange.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePage === page
                    ? "bg-[#EE0033] text-white shadow-md shadow-red-600/10 border border-[#EE0033]"
                    : "border border-gray-200 text-gray-600 hover:text-[#EE0033] hover:bg-red-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#EE0033] hover:bg-red-50 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Trang cuối"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableComponent;