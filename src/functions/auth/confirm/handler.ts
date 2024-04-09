import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { confirmUser } from '../../../infrastructure/cognito';
import {handleError} from "../../../helpers";

// Обработчик для подтверждения пользователя
export const confirmUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Получаем параметры из запроса
        const requestBody = JSON.parse(event.body);
        const { code, username } = requestBody;

        // Подтверждаем пользователя в Cognito
        const result = await confirmUser(code, username);

        // Возвращаем успешный ответ
        return { statusCode: 200, body: JSON.stringify(result) };
    } catch (error) {
        // Обрабатываем ошибку подтверждения
        return handleError(error);
    }
};

export const main = confirmUserHandler;
