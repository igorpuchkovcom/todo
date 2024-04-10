import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { loginUser } from '../../../infrastructure/cognito';

jest.mock('../../../infrastructure/cognito');

describe('Login API Endpoint', () => {
    it('should return success response on valid credentials', async () => {
        // Устанавливаем поведение мок-функции loginUser для успешного входа
        (loginUser as jest.Mock).mockResolvedValueOnce({ AccessToken: 'mocked_access_token' });

        // Тестовые данные для валидного входа
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testPassword'
            }),
            httpMethod: 'POST',
            path: '/auth/login',
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

        // Вызываем обработчик и ожидаем успешного ответа
        const response = await main(event);

        // Проверка успешного ответа
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).not.toHaveProperty('message');
        expect(responseBody).toHaveProperty('AccessToken', 'mocked_access_token');
    });

    it('should return error response on invalid credentials', async () => {
        // Устанавливаем поведение мок-функции loginUser для невалидного входа
        (loginUser as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials') as any); // Явное указание типа

        // Тестовые данные для невалидного входа
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'wrongPassword'
            }),
            path: '/auth/login',
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

        // Вызываем обработчик и ожидаем ошибочного ответа
        const response = await main(event);

        // Проверка ошибочного ответа
        expect(response.statusCode).toEqual(500);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error', 'Invalid credentials');
    });
});
