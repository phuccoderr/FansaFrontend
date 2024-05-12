import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface pagin {
  setState: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  totalPages: number;
}
const PaginationList: React.FC<pagin> = ({
  setState,
  pageNumber,
  totalPages,
}) => {
  const getPageNumbers = () => {
    const results = [];
    for (let i = 1; i <= totalPages; i++) {
      results.push(i);
    }
    return results;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setState(1)}
            className={`${
              pageNumber === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
          />
        </PaginationItem>
        {/* Hiển thị trang hiện tại và trang xung quanh */}
        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setState(page)}
              className={`cursor-pointer ${
                page === pageNumber ? "bg-green-300" : ""
              }`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => setState(totalPages)}
            className={`${
              pageNumber === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationList;
