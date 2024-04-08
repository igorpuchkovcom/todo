// src/functions/tasks/update/handler.ts

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {updateTaskInDatabase} from '../../../database';
import {DatabaseConfig} from '../../../types/database';

interface Task {
    id: string;
    title: string;
    description: string;
}

// Конфигурация базы данных
const config: DatabaseConfig = {
    databaseName: process.env.DOCUMENTDB_DATABASE,
    uri: process.env.DOCUMENTDB_URI
};

// Функция для обновления задачи
const updateTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Получение идентификатора задачи из параметров пути
    const taskId = event.pathParameters?.id;

    // Проверка наличия идентификатора задачи
    if (!taskId) {
        return formatJSONResponse({error: 'Task ID is required'}, 400);
    }

    // Парсинг тела запроса для получения новых данных задачи
    const requestBody = JSON.parse(event.body || '');
    const {title, description} = requestBody;

    // Проверка наличия новых данных для задачи
    if (!title || !description) {
        return formatJSONResponse({error: 'Missing required fields'}, 400);
    }

    try {
        // Обновление задачи в базе данных
        await updateTaskInDatabase(taskId, {title, description}, config);

        // Возвращаем успешный ответ с обновленными данными задачи
        const updatedTask: Task = {id: taskId, title, description};
        return formatJSONResponse({task: updatedTask}, 200);
    } catch (error) {
        // Возвращаем ошибку сервера
        return formatJSONResponse({error: 'Internal server error'}, 500);
    }
};

export const main = updateTaskHandler;
