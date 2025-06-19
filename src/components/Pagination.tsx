import React from "react";

interface ComponentProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (value: number) => void;
}

const Pagination: React.FC<ComponentProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const pages: (number | string)[] = [];

  if (totalPages === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="inline-block rounded-md border px-4 py-2 text-center text-gray-500">
          1
        </div>
      </div>
    );
  }

  const minPage = 1;
  const startPage = Math.max(minPage, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);

  // Always show the first page
  if (startPage > minPage + 1) {
    pages.push(minPage, "...");
  } else if (startPage === minPage + 1) {
    pages.push(minPage);
  }

  // Add the middle range
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Always show the last page
  if (endPage < totalPages - 1) {
    pages.push("...", totalPages);
  } else if (endPage === totalPages - 1) {
    pages.push(totalPages);
  }

  return (
    <div className="mt-6 flex justify-center space-x-2">
      <button
        className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
      >
        First
      </button>
      <button
        className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            className={`rounded-md border px-4 py-2 ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setCurrentPage(page)}
            disabled={currentPage === page}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-3 py-2 text-gray-500">
            {page}
          </span>
        ),
      )}
      <button
        className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <button
        className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
