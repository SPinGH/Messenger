export const getErrorMessage = (error?: any): string | undefined => {
    if (error && error.status !== 500 && error.data?.message) {
        return error.data.message;
    }
};
