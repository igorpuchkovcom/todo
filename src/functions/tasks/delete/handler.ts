import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {deleteTaskFromDatabase} from '../../../infrastructure/database';
import config from '../../../../config/database-config';

// Обработчик для удаления задачи
const deleteTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Проверка наличия идентификатора задачи в параметрах пути
    if (!event.pathParameters || !event.pathParameters.id) {
        // Возвращаем ошибку, если идентификатор задачи отсутствует
        return formatJSONResponse({error: 'Task ID is required'}, 400);
    }

    // Получение идентификатора задачи из параметров пути
    const taskId = event.pathParameters.id;

    try {
        // Удаление задачи из базы данных
        await deleteTaskFromDatabase(taskId, config);

        // Возвращаем успешный ответ
        return formatJSONResponse({message: 'Task deleted successfully'}, 200);
    } catch (error) {
        // Возвращаем ошибку сервера
        return formatJSONResponse({error: 'Internal server error'}, 500);
    }
};

export const main = deleteTaskHandler;
