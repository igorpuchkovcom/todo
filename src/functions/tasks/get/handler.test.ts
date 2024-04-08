import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getAllTasksFromDatabase } from '../../../database';

// Mock the database module
jest.mock('../../../database', () => ({
    getAllTasksFromDatabase: jest.fn()
}));

describe('Get Tasks API Endpoint', () => {
    it('should return list of tasks', async () => {
        // Mocked tasks data
        const mockedTasks = [
            { id: '1', title: 'Task 1', description: 'Description for Task 1' },
            { id: '2', title: 'Task 2', description: 'Description for Task 2' }
        ];

        // Mock the implementation of getAllTasksFromDatabase
        (getAllTasksFromDatabase as jest.Mock).mockResolvedValue(mockedTasks);

        // Тестовые данные для запроса списка задач
        const event: APIGatewayProxyEvent = {
            body: '',
            httpMethod: 'GET',
            path: '/api/tasks/get',
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            headers: {},
            multiValueHeaders: null,
            isBase64Encoded: false,
            requestContext: null,
            resource: ''
        };

        const response = await main(event);

        // Проверка успешного ответа
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);

        // Проверка наличия задач в объекте ответа
        expect(responseBody).toBeTruthy();
        expect(typeof responseBody).toEqual('object'); // Check that responseBody is an object

        // Проходим по всем ключам в объекте и проверяем, что они содержат задачи
        const tasksArray = Object.values(responseBody);
        expect(Array.isArray(tasksArray)).toBeTruthy();
        tasksArray.forEach((task: any) => {
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('description');
        });
    });
});
