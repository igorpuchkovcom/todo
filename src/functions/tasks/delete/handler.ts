import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

// Обработчик для API endpoint
const deleteTaskHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Реализовать здесь логику для удаления задачи
    // TODO: А пока просто возвращаем успешный ответ
    return formatJSONResponse({
        message: 'Task deleted successfully'
    });
};

export const main = deleteTaskHandler;
