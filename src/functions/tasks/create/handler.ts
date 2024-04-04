import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';

// Обработчик для API endpoint
const createTaskHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Реализовать здесь логику для создания новой задачи
    // TODO: А пока просто возвращаем успешный ответ
    return formatJSONResponse({
        message: 'New task created successfully'
    });
};

export const main = createTaskHandler;
