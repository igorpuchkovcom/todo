// Функция для проверки наличия обязательных полей в запросе
export const checkRequiredFields = (requestBody: any, requiredFields: string[]): boolean => {
    return requiredFields.every(field => requestBody.hasOwnProperty(field));
};
