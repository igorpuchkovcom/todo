import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

// Обработчик для API endpoint
const createTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Проверяем наличие обязательных полей
    const requestBody = JSON.parse(event.body);
    if (!requestBody.title || !requestBody.description) {
        // Возвращаем ошибку, если хотя бы одно из обязательных полей отсутствует
        return formatJSONResponse({
            error: 'Missing required fields'
        }, 400);
    }

    // TODO: Реализовать здесь логику для создания новой задачи
    // TODO: А пока просто возвращаем успешный ответ
    return formatJSONResponse({
        message: 'New task created successfully'
    }, 200);
};

export const main = createTaskHandler;
