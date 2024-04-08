// src/functions/tasks/delete/handler.test.ts

import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { deleteTaskFromDatabase } from '../../../database';

jest.mock('../../../database', () => ({
    deleteTaskFromDatabase: jest.fn(), // Создаем мок функции удаления задачи из базы данных
}));

describe('Delete Task API Endpoint', () => {
    it('should delete an existing task', async () => {
        // Тестовые данные для удаления существующей задачи
        const event: APIGatewayProxyEvent = {
            body: '',
            httpMethod: 'DELETE',
            path: '/tasks/delete',
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: { id: 'taskId123' }, // Здесь taskId123 - это идентификатор существующей задачи
            stageVariables: null,
            headers: {},
            multiValueHeaders: null,
            isBase64Encoded: false,
            requestContext: null,
            resource: ''
        };

        // Вызываем обработчик события
        const response = await main(event);

        // Проверяем, что функция удаления задачи из базы данных была вызвана с правильным аргументом
        expect(deleteTaskFromDatabase).toHaveBeenCalledWith('taskId123', expect.anything());

        // Проверяем успешный ответ
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
    });

    it('should return error response when task ID is not provided', async () => {
        // Тестовые данные для удаления задачи без предоставления идентификатора
        const event: APIGatewayProxyEvent = {
            body: '',
            httpMethod: 'DELETE',
            path: '/tasks/delete',
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            headers: {},
            multiValueHeaders: null,
            isBase64Encoded: false,
            requestContext: null,
            resource: ''
        };

        // Вызываем обработчик события
        const response = await main(event);

        // Проверяем ошибочный ответ
        expect(response.statusCode).toEqual(400);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toEqual('Task ID is required');
    });
});
