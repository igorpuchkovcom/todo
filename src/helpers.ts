import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from './libs/api-gateway';

// Функция для проверки наличия обязательных полей в запросе
export const checkRequiredFields = (requestBody: any, requiredFields: string[]): boolean => {
    return requiredFields.every(field => requestBody.hasOwnProperty(field));
};

// Функция для обработки ошибок
export const handleError = (error: Error): APIGatewayProxyResult => {
    return formatJSONResponse({error: error.message || 'Internal server error'}, 500);
};

// Функция для обработки аутентификации
export const handleAuthentication = async (event: APIGatewayProxyEvent, callback: (params: any) => Promise<APIGatewayProxyResult>): Promise<APIGatewayProxyResult> => {
    try {
        // Парсим тело запроса
        const requestBody = JSON.parse(event.body);

        // Проверяем наличие обязательных полей в запросе
        const requiredFields = ['email', 'password'];
        if (!checkRequiredFields(requestBody, requiredFields)) {
            // Возвращаем ошибку, если не все обязательные поля присутствуют в запросе
            return formatJSONResponse({error: 'Missing required fields'}, 400);
        }

        // Вызываем предоставленную функцию обратного вызова, передавая тело запроса
        return await callback(requestBody);
    } catch (error) {
        // Обрабатываем любую ошибку, возникшую в процессе обработки запроса
        return handleError(error);
    }
};
