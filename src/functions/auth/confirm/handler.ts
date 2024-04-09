import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { handleError } from '../helpers';

// Создаем экземпляр AWS SDK для работы с Cognito
const cognito = new CognitoIdentityServiceProvider();

// Обработчик для подтверждения пользователя
export const confirmUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Получаем параметры из запроса
        const requestBody = JSON.parse(event.body);
        const { code, username } = requestBody;

        // Подтверждаем пользователя в Cognito
        await cognito.confirmSignUp({
            ClientId: process.env.UserPoolClientId,
            ConfirmationCode: code,
            Username: username
        }).promise();

        // Возвращаем успешный ответ
        return formatJSONResponse({ message: 'User confirmed successfully' }, 200);
    } catch (error) {
        // Обрабатываем ошибку подтверждения
        return handleError(error);
    }
};

export const main = confirmUserHandler;
