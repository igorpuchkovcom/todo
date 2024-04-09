jest.mock('../../../infrastructure/cognito', () => ({
    confirmUser: jest.fn() // создание мок-функции
}));

import {APIGatewayProxyEvent} from 'aws-lambda';
import {confirmUserHandler} from './handler';
import {confirmUser} from '../../../infrastructure/cognito';

// Преобразуем тип confirmUser в jest.Mock, чтобы использовать методы mockResolvedValueOnce и mockRejectedValueOnce
const mockConfirmUser = confirmUser as jest.Mock;

describe('confirmUserHandler', () => {
    it('should confirm user successfully', async () => {
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

        // Создаем мок-функцию confirmUser, которая возвращает успешный результат
        mockConfirmUser.mockResolvedValueOnce({success: true});

        const result = await confirmUserHandler(event);

        expect(result.statusCode).toEqual(200);
        // Проверяем, что результат содержит ожидаемые данные
        expect(JSON.parse(result.body)).toEqual({success: true});
    });

    it('should handle errors gracefully', async () => {
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

        // Создаем мок-функцию confirmUser, которая выбрасывает ошибку
        mockConfirmUser.mockRejectedValueOnce(new Error('Confirmation error'));

        const result = await confirmUserHandler(event);

        expect(result.statusCode).toEqual(500);
        // Проверяем, что результат содержит ожидаемые данные
        expect(JSON.parse(result.body)).toEqual({error: 'Confirmation error'});
    });
});
