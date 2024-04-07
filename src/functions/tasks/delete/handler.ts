import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { deleteTaskFromDatabase } from '../../../database';

// Обработчик для API endpoint
const deleteTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Проверяем наличие идентификатора задачи
    if (!event.pathParameters || !event.pathParameters.id) {
        return formatJSONResponse({
            error: 'Task ID is required'
        }, 400);
    }

    // Получаем идентификатор задачи из параметров пути
    const taskId = event.pathParameters.id;

    try {
        // Параметры подключения к базе данных
        const config = {
            databaseName: process.env.DOCUMENTDB_DATABASE,
            uri: process.env.DOCUMENTDB_URI
        };

        // Удаляем задачу из базы данных
        await deleteTaskFromDatabase(taskId, config);

        // Возвращаем успешный ответ
        return formatJSONResponse({
            message: 'Task deleted successfully'
        }, 200);
    } catch (error) {
        // Возвращаем ошибку сервера
        return formatJSONResponse({
            error: 'Internal server error'
        }, 500);
    }
};

export const main = deleteTaskHandler;
