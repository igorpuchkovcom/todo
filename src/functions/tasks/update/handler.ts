import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

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

    // TODO: Здесь должна быть логика обновления задачи в базе данных

    // Возвращаем успешный ответ с обновленными данными задачи
    const updatedTask: Task = { id: taskId, title, description };
    return formatJSONResponse({ task: updatedTask }, 200);
};

export const main = updateTask;
