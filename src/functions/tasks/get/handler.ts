import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { getAllTasksFromDatabase } from '../../../database';

interface Task {
    id: string;
    title: string;
    description: string;
}

// Обработчик для API endpoint
const getTasksHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Параметры подключения к базе данных
        const config = {
            databaseName: process.env.DOCUMENTDB_DATABASE,
            uri: process.env.DOCUMENTDB_URI
        };

        // Получаем все задачи из базы данных
        const tasks: Task[] = await getAllTasksFromDatabase(config);

        // Преобразуем массив задач в объект, где ключами будут идентификаторы задач
        const tasksObject = tasks.reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
        }, {});

        // Возвращаем успешный ответ с объектом задач
        return formatJSONResponse(tasksObject, 200);
    } catch (error) {
        // Возвращаем ошибку сервера
        return formatJSONResponse({
            error: 'Internal server error'
        }, 500);
    }
};

export const main = getTasksHandler;
