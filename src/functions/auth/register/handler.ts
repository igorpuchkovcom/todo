import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {registerUser} from '../../../infrastructure/cognito';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {handleError} from '../../../helpers';

export const registerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Получаем параметры из запроса
        const requestBody = JSON.parse(event.body);
        const {username, email, password} = requestBody;

        // Регистрируем пользователя в Cognito
        const result = await registerUser(username, email, password);

        // Возвращаем успешный ответ
        return formatJSONResponse(result, 200);
    } catch (error) {
        // Обрабатываем ошибку подтверждения
        return handleError(error);
    }
};

export const main = registerHandler;
