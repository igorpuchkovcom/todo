import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { confirmUser } from '../../../infrastructure/cognito';
import {handleError} from '../../../helpers';
import {formatJSONResponse} from "../../../libs/api-gateway";

// Обработчик для подтверждения пользователя
export const confirmUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Получаем параметры из запроса
        const requestBody = JSON.parse(event.body);
        const { code, username } = requestBody;

        // Подтверждаем пользователя в Cognito
        const result = await confirmUser(code, username);

        // Возвращаем успешный ответ
        return formatJSONResponse(result, 200);
    } catch (error) {
        // Обрабатываем ошибку подтверждения
        return handleError(error);
    }
};

export const main = confirmUserHandler;
