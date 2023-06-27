export const getLastMessageTime = (date: string) => {
    return new Date(date).toTimeString().substring(0, 5);
};
