import request from 'supertest'; // Импортируем supertest для отправки запросов к приложению Express
import {app} from './handler'; // Импортируем обработчик Express

// Mock the database module
jest.mock('../../../infrastructure/database', () => ({
    getAllTasksFromDatabase: jest.fn().mockResolvedValue([
        {id: '1', title: 'Task 1', description: 'Description for Task 1'},
        {id: '2', title: 'Task 2', description: 'Description for Task 2'}
    ])
}));

describe('Get Tasks API Endpoint', () => {
    it('should return list of tasks', async () => {
        // Send a GET request to the Express app
        const response = await request(app)
            .get('/tasks/get');

        // Check for successful response
        expect(response.status).toEqual(200);

        // Check that the response body is not empty
        expect(response.body).not.toEqual('');

        // Decode the 'tasks' string from JSON
        const tasks = response.body;

        // Check that tasks is an array
        expect(Array.isArray(tasks)).toBeTruthy();

        // Check if the returned tasks match the mocked tasks
        expect(tasks).toEqual([
            {id: '1', title: 'Task 1', description: 'Description for Task 1'},
            {id: '2', title: 'Task 2', description: 'Description for Task 2'}
        ]);
    });
});
