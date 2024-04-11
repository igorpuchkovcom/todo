import request from 'supertest'; // Импортируем supertest для отправки запросов к приложению Express
import {app} from './handler'; // Импортируем обработчик Express
import {insertTaskIntoDatabase} from '../../../infrastructure/database'; // Мокируем функцию вставки задачи в базу данных

jest.mock('../../../infrastructure/database'); // Мокируем модуль database

describe('Create Task API Endpoint', () => {
    // Тестирование успешного создания задачи
    it('should create a new task successfully', async () => {
        // Вызываем обработчик с POST-запросом к приложению Express
        const response = await request(app)
            .post('/tasks/create')
            .send({
                title: 'Test Task',
                description: 'Test Description',
            });

        // Проверяем успешный ответ
        expect(response.status).toEqual(200);
        expect(typeof response.body).toEqual('object');
        expect(response.body).toHaveProperty('message', 'New task created successfully');
    });

    // Тестирование ошибки сервера при вставке в базу данных
    it('should return an internal server error when database insertion fails', async () => {
        // Устанавливаем мок функцию вставки задачи в базу данных, чтобы выбросить ошибку
        (insertTaskIntoDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database insertion failed'));

        // Вызываем обработчик с POST-запросом к приложению Express
        const response = await request(app)
            .post('/tasks/create')
            .send({
                title: 'Test Task',
                description: 'Test Description',
            });

        // Проверяем ошибку сервера
        expect(response.status).toEqual(500);
    });
});
