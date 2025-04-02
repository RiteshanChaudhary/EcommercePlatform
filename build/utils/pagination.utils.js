"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationData = void 0;
const getPaginationData = (page, limit, totalCount) => {
    const totalPages = Math.ceil(totalCount / limit);
    return {
        total: totalCount,
        totalPages,
        currentPage: page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        hasNextPage: page < totalPages ? true : false,
    };
};
exports.getPaginationData = getPaginationData;
