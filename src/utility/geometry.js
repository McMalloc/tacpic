export const mirrorPoint = (x, y, xa, ya) => {
    return {
        x: 2* xa - x,
        y: 2* ya - y
    };
};
