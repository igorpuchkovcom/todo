import request from 'supertest'; // Импортируем supertest для отправки запросов к приложению Express
import {app} from './handler'; // Импортируем обработчик Express
import {registerUser} from '../../../infrastructure/cognito'; // Мокируем функцию регистрации пользователя

jest.mock('../../../infrastructure/cognito'); // Мокируем модуль cognito

describe('Register API Endpoint', () => {
    it('should return success response on valid input', async () => {
        // Устанавливаем поведение мок-функции registerUser для успешной регистрации
        (registerUser as jest.Mock).mockResolvedValueOnce({UserSub: '123456789'});

        // Тестовые данные для валидной регистрации
        const requestData = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword'
        };

        // Отправляем POST-запрос к приложению Express
        const response = await request(app)
            .post('/auth/register')
            .send(requestData);

        // Проверяем успешный ответ
        expect(response.status).toEqual(200);
        expect(typeof response.body).toEqual('object');
        expect(response.body).toHaveProperty('UserSub', '123456789'); // Проверяем успешную регистрацию
    });

    it('should return error response when required fields are missing', async () => {
        // Устанавливаем поведение мок-функции registerUser для невалидной регистрации
        (registerUser as jest.Mock).mockRejectedValueOnce(new Error('Missing required fields'));

        // Тестовые данные для невалидной регистрации
        const requestData = {
            username: 'testUser',
            email: 'test@example.com',
        };

        // Отправляем POST-запрос к приложению Express
        const response = await request(app)
            .post('/auth/register')
            .send(requestData);

        // Проверяем ответ с ошибкой
        expect(response.status).toEqual(500);
    });
});
