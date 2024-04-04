import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

// Обработчик для API endpoint
const registerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Проверяем наличие обязательных полей
    const requestBody = JSON.parse(event.body);
    if (!requestBody.username || !requestBody.email || !requestBody.password) {
        return formatJSONResponse({
            error: 'Missing required fields'
        }, 400);
    }

    // TODO: Реализовать здесь логику для регистрации нового пользователя
    // TODO: А пока просто возвращаем успешный ответ
    return formatJSONResponse({
        message: 'User registration successful',
        user: {
            id: 'generated_user_id',
            username: requestBody.username,
            email: requestBody.email
        }
    }, 200);
};

export const main = registerHandler;
