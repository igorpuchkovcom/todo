import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Get Tasks API Endpoint', () => {
    it('should return list of tasks', async () => {
        // Тестовые данные для запроса списка задач
        const event: APIGatewayProxyEvent = {
            body: '',
            httpMethod: 'GET',
            path: '/api/tasks/get',
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
        const responseBody = JSON.parse(response.body);

        // Проверка наличия задач в объекте ответа
        expect(responseBody).toBeTruthy();
        expect(typeof responseBody).toEqual('object');

        // Проходим по всем ключам в объекте и проверяем, что они содержат задачи
        Object.values(responseBody).forEach((task: any) => {
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('description');
        });
    });
});
