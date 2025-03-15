

export const getPaginationData = (page:number, limit:number, totalCount:number) => {
    const totalPages = Math.ceil(totalCount/limit);

    return {
        total : totalCount,
        totalPages,
        currentPage:page,
        previousPage: page>1 ? page -1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        hasNextPage: page < totalPages? true : false,
    }
}