import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {insertTaskIntoDatabase} from '../../../infrastructure/database';
import config from '../../../../config/database-config';

// Проверка наличия обязательных полей в запросе
const validateRequestBody = (body: any): boolean => {
    return !!body.title && !!body.description;
};

// Обработчик для создания новой задачи
const createTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Парсинг тела запроса
        const requestBody = JSON.parse(event.body);

        // Проверка наличия обязательных полей в теле запроса
        if (!validateRequestBody(requestBody)) {
            // Возвращаем ошибку, если обязательные поля отсутствуют
            return formatJSONResponse({error: 'Missing required fields'}, 400);
        }

        // Вставка новой задачи в базу данных
        await insertTaskIntoDatabase(requestBody, config);

        // Возвращаем успешный ответ
        return formatJSONResponse({message: 'New task created successfully'}, 200);
    } catch (error) {
        // Учитываем случай, если вставка в базу данных не удалась
        if (error.message === 'Database insertion failed') {
            return formatJSONResponse({error: 'Database insertion failed'}, 500);
        }
        // Возвращаем общую ошибку сервера для других типов ошибок
        return formatJSONResponse({error: 'Internal server error'}, 500);
    }
};

export const main = createTaskHandler;
