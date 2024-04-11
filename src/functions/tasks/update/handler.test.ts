import request from 'supertest'; // Импортируем supertest для отправки запросов к приложению Express
import {app} from './handler'; // Импортируем обработчик Express

// Мокируем модуль базы данных
jest.mock('../../../infrastructure/database', () => ({
    updateTaskInDatabase: jest.fn()
}));

describe('Update Task API Endpoint', () => {
    it('should update an existing task', async () => {
        // Отправляем PUT-запрос к приложению Express с обновленными данными задачи
        const response = await request(app)
            .put('/tasks/update/taskId123')
            .send({
                title: 'Updated Task',
                description: 'This is an updated task'
            });

        // Проверяем успешный ответ
        expect(response.status).toEqual(200);
        expect(typeof response.body).toEqual('object');
        expect(response.body).toHaveProperty('message', 'Task updated successfully');
    });

    it('should return error response when task ID is not provided', async () => {
        // Отправляем PUT-запрос к приложению Express без указания ID задачи
        const response = await request(app)
            .put('/tasks/update');

        // Проверяем ошибочный ответ
        expect(response.status).toEqual(404);
    });
});
