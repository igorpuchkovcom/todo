import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

interface Task {
    id: string;
    title: string;
    description: string;
}

// Обработчик для API endpoint
const getTasksHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Реализовать здесь логику для получения списка задач
    // TODO: А пока просто возвращаем список задач для демонстрации
    const tasks: Task[] = [
        { id: '1', title: 'Task 1', description: 'Description for Task 1' },
        { id: '2', title: 'Task 2', description: 'Description for Task 2' }
    ];

    // Преобразование массива задач в объект
    const tasksObject = tasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
    }, {});

    return formatJSONResponse(tasksObject, 200);
};

export const main = getTasksHandler;
