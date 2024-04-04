import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Login API Endpoint', () => {
    it('should return success response on valid credentials', async () => {
        // Тестовые данные для валидного входа
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testPassword'
            }),
            httpMethod: 'POST',
            path: '/api/auth/login',
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
        expect(responseBody).toHaveProperty('message', 'Login successful');
        expect(responseBody).toHaveProperty('token');
    });

    it('should return error response on invalid credentials', async () => {
        // Тестовые данные для невалидного входа
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'wrongPassword'
            }),
            path: '/api/auth/login',
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
        expect(response.statusCode).toEqual(401);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error', 'Invalid credentials');
    });
});
