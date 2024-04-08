// src/functions/tasks/get/handler.ts

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {getAllTasksFromDatabase} from '../../../database';
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

// Обработчик для получения всех задач
const getTasksHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Получение всех задач из базы данных
        const tasks: Task[] = await getAllTasksFromDatabase(config);

        // Преобразование массива задач в объект, где ключами будут идентификаторы задач
        const tasksObject = tasks.reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
        }, {});

        // Возвращаем успешный ответ с объектом задач
        return formatJSONResponse(tasksObject, 200);
    } catch (error) {
        // Возвращаем ошибку сервера
        return formatJSONResponse({error: 'Internal server error'}, 500);
    }
};

export const main = getTasksHandler;
