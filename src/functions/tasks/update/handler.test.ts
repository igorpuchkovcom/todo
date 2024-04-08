import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateTaskInDatabase } from '../../../database';

jest.mock('../../../database', () => ({
    updateTaskInDatabase: jest.fn(), // Создаем мок функции обновления задачи в базе данных
}));

describe('Update Task API Endpoint', () => {
    it('should update an existing task', async () => {
        // Тестовые данные для обновления существующей задачи
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                title: 'Updated Task',
                description: 'This is an updated task'
            }),
            path: '/api/tasks/update',
            httpMethod: 'PUT',
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

        const response = await main(event);

        // Проверяем, что функция обновления задачи в базе данных была вызвана с правильными аргументами
        expect(updateTaskInDatabase).toHaveBeenCalledWith(
            'taskId123',
            { title: 'Updated Task', description: 'This is an updated task' },
            {
                databaseName: 'todo',
                uri: 'mongodb://' + process.env.DocumentDBHost
            }
        );

        // Проверка успешного ответа
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
    });

    it('should return error response when task ID is not provided', async () => {
        // Тестовые данные для обновления задачи без предоставления идентификатора
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                title: 'Updated Task',
                description: 'This is an updated task'
            }),
            path: '/api/tasks/update',
            httpMethod: 'PUT',
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

        const response = await main(event);

        // Проверка ошибочного ответа
        expect(response.statusCode).toEqual(400);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toEqual('Task ID is required');
    });
});
