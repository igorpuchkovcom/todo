import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Create Task API Endpoint', () => {
    it('should create a new task', async () => {
        // Тестовые данные для создания новой задачи
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                title: 'Test Task',
                description: 'This is a test task'
            }),
            path: '/api/tasks/create',
            httpMethod: 'POST',
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

        // Проверка успешного ответа
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
    });

    it('should return error response when required fields are missing', async () => {
        // Тестовые данные для создания новой задачи без обязательных полей
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                description: 'This is a test task'
            }),
            path: '/api/tasks/create',
            httpMethod: 'POST',
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
        expect(responseBody.error).toEqual('Missing required fields');
    });
});
