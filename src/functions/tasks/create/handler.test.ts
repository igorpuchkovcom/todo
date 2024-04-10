import {APIGatewayProxyEvent} from 'aws-lambda';
import {main} from './handler'; // Импортируем обработчик, который мы хотим протестировать
import {insertTaskIntoDatabase} from '../../../infrastructure/database'; // Импортируем функцию вставки задачи в базу данных

jest.mock('../../../infrastructure/database', () => ({
    insertTaskIntoDatabase: jest.fn(), // Создаем мок функции вставки задачи в базу данных
}));

// Создаем mock объект события APIGatewayProxyEvent
const event: APIGatewayProxyEvent = {
    body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
    }),
} as unknown as APIGatewayProxyEvent;

describe('Create Task API Endpoint', () => {
    // Тестирование успешного создания задачи
    it('should create a new task successfully', async () => {
        // Вызываем обработчик с событием
        const response = await main(event);

        // Проверяем, что функция вставки задачи в базу данных была вызвана с правильными аргументами
        expect(insertTaskIntoDatabase).toHaveBeenCalledWith(
            {title: 'Test Task', description: 'Test Description'},
            {
                databaseName: 'todo',
                uri: 'mongodb://' + process.env.DocumentDBHost
            }
        );

        // Проверяем, что обработчик возвращает ожидаемый успешный ответ
        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({message: 'New task created successfully'}),
        });
    });

    // Тестирование неполных данных
    it('should return an error when required fields are missing', async () => {
        // Создаем mock объект события APIGatewayProxyEvent с отсутствующими обязательными полями
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({}),
        } as unknown as APIGatewayProxyEvent;

        // Вызываем обработчик с событием
        const response = await main(event);

        // Проверяем, что обработчик возвращает ожидаемую ошибку о недостающих полях
        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({error: 'Missing required fields'}),
        });
    });

    // Тестирование ошибки сервера при вставке в базу данных
    it('should return an internal server error when database insertion fails', async () => {
        // Устанавливаем мок функцию вставки задачи в базу данных, чтобы выбросить ошибку
        (insertTaskIntoDatabase as jest.Mock).mockRejectedValue(new Error('Database insertion failed'));

        // Вызываем обработчик с событием
        const response = await main(event);

        // Проверяем, что обработчик возвращает ожидаемую ошибку сервера
        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({error: 'Database insertion failed'}),
        });
    });
});
