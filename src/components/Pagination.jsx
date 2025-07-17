// Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	// This robust logic ensures the pagination is always centered and clean.
	const getPageNumbers = () => {
		const pageNumbers = [];
		// The maximum number of page links to show
		const pagesToShow = 7;
		const pageSpread = Math.floor(pagesToShow / 2);

		if (totalPages <= pagesToShow) {
			// If total pages are few, show all of them
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Always show the first page
			pageNumbers.push(1);

			let start = Math.max(2, currentPage - pageSpread + 1);
			let end = Math.min(totalPages - 1, currentPage + pageSpread - 1);

			if (currentPage < pageSpread + 1) {
				end = pagesToShow - 2;
			}

			if (currentPage > totalPages - pageSpread) {
				start = totalPages - pagesToShow + 3;
			}

			if (start > 2) {
				pageNumbers.push("...");
			}

			for (let i = start; i <= end; i++) {
				pageNumbers.push(i);
			}

			if (end < totalPages - 1) {
				pageNumbers.push("...");
			}

			// Always show the last page
			pageNumbers.push(totalPages);
		}
		return pageNumbers;
	};

	const pageNumbers = getPageNumbers();

	const commonButtonStyles =
		"w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
	const activeStyles =
		"bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg";
	const inactiveStyles =
		"bg-neutral-800/50 border border-neutral-700/80 text-neutral-300 hover:bg-neutral-700/80 hover:border-neutral-600 hover:scale-105";
	const disabledStyles =
		"text-neutral-600 cursor-not-allowed bg-neutral-800/30";

	return (
		<nav className="flex justify-center py-4">
			<ul className="flex items-center space-x-2">
				{/* Previous Button */}
				<li>
					<button
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className={`${commonButtonStyles} ${
							currentPage === 1 ? disabledStyles : inactiveStyles
						}`}
						aria-label="Previous page"
					>
						<ChevronLeft size={20} />
					</button>
				</li>

				{/* Page Numbers */}
				{pageNumbers.map((number, index) => (
					<li key={index}>
						{number === "..." ? (
							<span className="w-10 h-10 flex items-center justify-center text-neutral-500">
								<MoreHorizontal size={20} />
							</span>
						) : (
							<button
								onClick={() => onPageChange(number)}
								className={`${commonButtonStyles} ${
									currentPage === number ? activeStyles : inactiveStyles
								}`}
								aria-current={currentPage === number ? "page" : undefined}
							>
								{number}
							</button>
						)}
					</li>
				))}

				{/* Next Button */}
				<li>
					<button
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						className={`${commonButtonStyles} ${
							currentPage === totalPages ? disabledStyles : inactiveStyles
						}`}
						aria-label="Next page"
					>
						<ChevronRight size={20} />
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
