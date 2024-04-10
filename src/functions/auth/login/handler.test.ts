import {main} from './handler';
import {APIGatewayProxyEvent} from 'aws-lambda';
import {loginUser} from '../../../infrastructure/cognito';

jest.mock('../../../infrastructure/cognito');

const event: APIGatewayProxyEvent = {
    httpMethod: 'POST',
    path: '/auth/login',
} as unknown as APIGatewayProxyEvent;

describe('Login API Endpoint', () => {
    it('should return success response on valid credentials', async () => {
        // Устанавливаем поведение мок-функции loginUser для успешного входа
        (loginUser as jest.Mock).mockResolvedValueOnce({AccessToken: 'mocked_access_token'});

        // Тестовые данные для валидного входа
        event.body = JSON.stringify({
            email: 'test@example.com',
            password: 'testPassword'
        });

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
        event.body = JSON.stringify({
            email: 'test@example.com',
            password: 'wrongPassword'
        });

        // Вызываем обработчик и ожидаем ошибочного ответа
        const response = await main(event);

        // Проверка ошибочного ответа
        expect(response.statusCode).toEqual(500);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error', 'Invalid credentials');
    });
});
