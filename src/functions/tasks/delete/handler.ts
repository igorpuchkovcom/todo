import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

// Обработчик для API endpoint
const deleteTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Проверяем наличие идентификатора задачи
    if (!event.pathParameters || !event.pathParameters.id) {
        return formatJSONResponse({
            error: 'Task ID is required'
        }, 400);
    }

    // TODO: Реализовать здесь логику для удаления задачи
    // TODO: А пока просто возвращаем успешный ответ
    return formatJSONResponse({
        message: 'Task deleted successfully'
    }, 200);
};

export const main = deleteTaskHandler;
