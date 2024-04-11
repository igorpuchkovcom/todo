import request from 'supertest'; // Импортируем supertest для отправки запросов к приложению Express
import {app} from './handler'; // Импортируем обработчик Express

jest.mock('../../../infrastructure/database'); // Мокируем модуль database

describe('Delete Task API Endpoint', () => {
    // Тестирование успешного удаления существующей задачи
    it('should delete an existing task', async () => {
        // Вызываем обработчик с DELETE-запросом к приложению Express
        const response = await request(app)
            .delete('/tasks/delete/taskId123');

        // Проверяем успешный ответ
        expect(response.status).toEqual(200);
        expect(typeof response.body).toEqual('object');
        expect(response.body).toHaveProperty('message', 'Task deleted successfully');
    });

    // Тестирование ошибки при отсутствии ID задачи
    it('should return error response when task ID is not provided', async () => {
        // Вызываем обработчик с DELETE-запросом к приложению Express без указания ID задачи
        const response = await request(app).delete('/tasks/delete');

        // Проверяем ошибочный ответ
        expect(response.status).toEqual(404);
    });
});
