import {main} from './handler';
import {APIGatewayProxyEvent} from 'aws-lambda';
import {registerUser} from '../../../infrastructure/cognito';

jest.mock('../../../infrastructure/cognito', () => ({
    registerUser: jest.fn(),
}));

const event: APIGatewayProxyEvent = {
    path: '/auth/register',
    httpMethod: 'POST',
} as unknown as APIGatewayProxyEvent;

describe('Register API Endpoint', () => {
    it('should return success response on valid input', async () => {
        // Устанавливаем поведение мок-функции registerUser для успешной регистрации
        (registerUser as jest.Mock).mockResolvedValueOnce({UserSub: '123456789'});

        event.body = JSON.stringify({
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword'
        });

        const response = await main(event);

        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).not.toBeNull(); // Проверяем, что тело ответа не пустое
        expect(responseBody).toHaveProperty('UserSub', '123456789'); // Проверяем успешную регистрацию
    });

    it('should return error response when required fields are missing', async () => {
        // Устанавливаем поведение мок-функции registerUser для невалидной регистрации
        (registerUser as jest.Mock).mockRejectedValueOnce(new Error('Missing required fields'));

        event.body = JSON.stringify({
            username: 'testUser',
            email: 'test@example.com',
        });

        const response = await main(event);

        expect(response.statusCode).toEqual(500);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error', 'Missing required fields'); // Проверяем ошибку
    });
});
