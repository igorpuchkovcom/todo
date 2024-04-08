import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('aws-sdk', () => {
    const successfulConfirmMock = {
        promise: jest.fn().mockResolvedValue({}),
    };

    const failedConfirmMock = {
        promise: jest.fn().mockImplementation(() => {
            throw { code: 'CodeMismatchException' };
        }),
    };

    const mCognito = {
        confirmSignUp: jest.fn().mockImplementation((params: any) => {
            if (params.ConfirmationCode === '123456' && params.Username === 'testUser') {
                return successfulConfirmMock;
            } else {
                return failedConfirmMock;
            }
        }),
    };

    return {
        CognitoIdentityServiceProvider: jest.fn(() => mCognito),
    };
});

describe('Confirm User API Endpoint', () => {
    it('should return success response on valid confirmation code', async () => {
        // Тестовые данные для валидации пользователя
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                code: '123456',
                username: 'testUser'
            }),
            httpMethod: 'POST',
            path: '/auth/confirm',
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
        expect(responseBody).toHaveProperty('message', 'User confirmed successfully');
    });

    it('should return error response on invalid confirmation code', async () => {
        // Тестовые данные для невалидного подтверждения пользователя
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                code: 'invalidCode',
                username: 'testUser'
            }),
            httpMethod: 'POST',
            path: '/auth/confirm',
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
        expect(response.statusCode).toEqual(500); // Assuming you handle CodeMismatchException as a 400 Bad Request
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toEqual('Internal server error');
    });
});
