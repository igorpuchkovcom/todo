import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { updateTaskInDatabase } from '../../../database'; // Подключаем функцию для обновления задачи в базе данных

interface Task {
    id: string;
    title: string;
    description: string;
}

// Функция для обновления задачи
const updateTask = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Получаем идентификатор задачи из параметров пути
    const taskId = event.pathParameters?.id;

    // Проверяем, был ли предоставлен идентификатор задачи
    if (!taskId) {
        return formatJSONResponse({ error: 'Task ID is required' }, 400);
    }

    // Парсим тело запроса для получения новых данных задачи
    const requestBody = JSON.parse(event.body || '');
    const { title, description } = requestBody;

    // Проверяем, были ли предоставлены новые данные для задачи
    if (!title || !description) {
        return formatJSONResponse({ error: 'Missing required fields' }, 400);
    }

    try {
        // Параметры подключения к базе данных
        const config = {
            databaseName: process.env.DOCUMENTDB_DATABASE,
            uri: process.env.DOCUMENTDB_URI
        };

        // Обновляем задачу в базе данных
        await updateTaskInDatabase(taskId, { title, description }, config);

        // Возвращаем успешный ответ с обновленными данными задачи
        const updatedTask: Task = { id: taskId, title, description };
        return formatJSONResponse({ task: updatedTask }, 200);
    } catch (error) {
        // Возвращаем ошибку сервера
        return formatJSONResponse({ error: 'Internal server error' }, 500);
    }
};

export const main = updateTask;
