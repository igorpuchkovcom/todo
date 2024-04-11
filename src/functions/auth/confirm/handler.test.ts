import request from 'supertest';
import {app} from './handler';
import {confirmUser} from '../../../infrastructure/cognito';

jest.mock('../../../infrastructure/cognito', () => ({
    confirmUser: jest.fn() // создание мок-функции
}));

// Преобразуем тип confirmUser в jest.Mock, чтобы использовать методы mockResolvedValueOnce и mockRejectedValueOnce
const mockConfirmUser = confirmUser as jest.Mock;

describe('confirmUserHandler', () => {
    it('should confirm user successfully', async () => {
        // Создаем мок-функцию confirmUser, которая возвращает успешный результат
        mockConfirmUser.mockResolvedValueOnce({success: true});

        const response = await request(app)
            .post('/auth/confirm')
            .send({code: '123456', username: 'testUser'});

        expect(response.status).toEqual(200);
        // Проверяем, что ответ содержит ожидаемые данные
        expect(response.body).toEqual({success: true});
    });

    it('should handle errors gracefully', async () => {
        // Создаем мок-функцию confirmUser, которая выбрасывает ошибку
        mockConfirmUser.mockRejectedValueOnce(new Error('Internal server error'));

        const response = await request(app)
            .post('/auth/confirm')
            .send({code: 'invalidCode', username: 'testUser'});

        expect(response.status).toEqual(500);
    });
});
