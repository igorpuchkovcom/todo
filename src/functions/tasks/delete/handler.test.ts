import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { deleteTaskFromDatabase } from '../../../infrastructure/database';

jest.mock('../../../infrastructure/database', () => ({
    deleteTaskFromDatabase: jest.fn(), // Создаем мок функции удаления задачи из базы данных
}));

const event: APIGatewayProxyEvent = {
    body: '',
    httpMethod: 'DELETE',
    path: '/tasks/delete',
} as unknown as APIGatewayProxyEvent;


describe('Delete Task API Endpoint', () => {
    it('should delete an existing task', async () => {
        event.pathParameters = { id: 'taskId123' };
        const response = await main(event);

        // Проверяем, что функция удаления задачи из базы данных была вызвана с правильным аргументом
        expect(deleteTaskFromDatabase).toHaveBeenCalledWith('taskId123', expect.anything());

        // Проверяем успешный ответ
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
    });

    it('should return error response when task ID is not provided', async () => {
        delete event.pathParameters;
        const response = await main(event);

        // Проверяем ошибочный ответ
        expect(response.statusCode).toEqual(400);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toEqual('Task ID is required');
    });
});
