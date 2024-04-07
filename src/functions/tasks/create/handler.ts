require('dotenv').config();

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import {insertTaskIntoDatabase} from '../../../database';

// Обработчик для API endpoint
const createTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Проверяем наличие обязательных полей
        const requestBody = JSON.parse(event.body);
        if (!requestBody.title || !requestBody.description) {
            // Возвращаем ошибку, если хотя бы одно из обязательных полей отсутствует
            return formatJSONResponse({
                error: 'Missing required fields'
            }, 400);
        }

        // Параметры подключения к базе данных
        const config = {
            databaseName: process.env.DOCUMENTDB_DATABASE,
            uri: process.env.DOCUMENTDB_URI
        };

        // Вставляем новую задачу в базу данных
        await insertTaskIntoDatabase(requestBody, config);

        // Возвращаем успешный ответ
        return formatJSONResponse({
            message: 'New task created successfully'
        }, 200);
    } catch (error) {
        // Учитываем случай, если ошибка связана с вставкой в базу данных
        if (error.message === 'Database insertion failed') {
            return formatJSONResponse({
                error: 'Database insertion failed'
            }, 500);
        }

        // Возвращаем общую ошибку сервера для других типов ошибок
        return formatJSONResponse({
            error: 'Internal server error'
        }, 500);
    }
};

export const main = createTaskHandler;
