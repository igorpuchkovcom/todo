import request from 'supertest';
import {app} from './handler'; // Импортируем наше express-приложение
import {loginUser} from '../../../infrastructure/cognito'; // Мокируем функцию loginUser из инфраструктурного слоя

jest.mock('../../../infrastructure/cognito'); // Мокируем инфраструктурный слой

describe('Login API Endpoint', () => {
    it('should return success response on valid credentials', async () => {
        // Устанавливаем поведение мок-функции для успешного входа
        (loginUser as jest.Mock).mockResolvedValueOnce({AccessToken: 'mocked_access_token'});

        // Тестовые данные для валидного входа
        const requestData = {
            email: 'test@example.com',
            password: 'testPassword'
        };

        // Отправляем запрос на обработчик и ожидаем успешный ответ
        const response = await request(app)
            .post('/auth/login')
            .send(requestData);

        // Проверяем успешный ответ
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('AccessToken', 'mocked_access_token');
    });

    it('should return error response on invalid credentials', async () => {
        // Устанавливаем поведение мок-функции для невалидного входа
        (loginUser as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

        // Тестовые данные для невалидного входа
        const requestData = {
            email: 'test@example.com',
            password: 'wrongPassword'
        };

        // Отправляем запрос на обработчик и ожидаем ответ с ошибкой
        const response = await request(app)
            .post('/auth/login')
            .send(requestData);

        // Проверяем ответ с ошибкой
        expect(response.status).toEqual(500);
    });
});
