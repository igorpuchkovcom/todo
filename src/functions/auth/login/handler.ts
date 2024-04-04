import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

// Обработчик для API endpoint
const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Проверяем, правильность переданных учетных данных
    const requestBody = JSON.parse(event.body);
    // TODO: Реализовать здесь логику для аутентификации пользователя и генерации токена
    // TODO: А пока просто возвращаем успешный ответ с токеном
    if (requestBody.email !== 'test@example.com' || requestBody.password !== 'testPassword') {
        // Если учетные данные неверные, возвращаем ошибку с кодом 401
        return formatJSONResponse({
            error: 'Invalid credentials'
        }, 401);
    }

    // Если учетные данные верные, возвращаем успешный ответ с токеном
    return formatJSONResponse({
        message: 'Login successful',
        token: 'generated_token_here'
    }, 200);
};

export const main = loginHandler;
