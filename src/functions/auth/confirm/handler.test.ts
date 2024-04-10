import {APIGatewayProxyEvent} from 'aws-lambda';
import {main} from './handler';
import {confirmUser} from '../../../infrastructure/cognito';

jest.mock('../../../infrastructure/cognito', () => ({
    confirmUser: jest.fn() // создание мок-функции
}));

// Преобразуем тип confirmUser в jest.Mock, чтобы использовать методы mockResolvedValueOnce и mockRejectedValueOnce
const mockConfirmUser = confirmUser as jest.Mock;

const event: APIGatewayProxyEvent = {
    httpMethod: 'POST',
    path: '/auth/confirm',
} as unknown as APIGatewayProxyEvent;



describe('confirmUserHandler', () => {
    it('should confirm user successfully', async () => {
        event.body = JSON.stringify({
            code: '123456',
            username: 'testUser'
        })

        // Создаем мок-функцию confirmUser, которая возвращает успешный результат
        mockConfirmUser.mockResolvedValueOnce({success: true});

        const result = await main(event);

        expect(result.statusCode).toEqual(200);
        // Проверяем, что результат содержит ожидаемые данные
        expect(JSON.parse(result.body)).toEqual({success: true});
    });

    it('should handle errors gracefully', async () => {
        event.body = JSON.stringify({
            code: 'invalidCode',
            username: 'testUser'
        });

        // Создаем мок-функцию confirmUser, которая выбрасывает ошибку
        mockConfirmUser.mockRejectedValueOnce(new Error('Confirmation error'));

        const result = await main(event);

        expect(result.statusCode).toEqual(500);
        // Проверяем, что результат содержит ожидаемые данные
        expect(JSON.parse(result.body)).toEqual({error: 'Confirmation error'});
    });
});
