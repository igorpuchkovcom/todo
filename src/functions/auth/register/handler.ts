import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Создаем экземпляр AWS SDK для работы с Cognito
const cognito = new CognitoIdentityServiceProvider();

const registerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestBody = JSON.parse(event.body);

    // Проверяем наличие обязательных полей
    if (!requestBody.username || !requestBody.email || !requestBody.password) {
        return formatJSONResponse({
            error: 'Missing required fields'
        }, 400);
    }

    try {
        // Регистрируем пользователя в Cognito
        const signUpResponse = await cognito.signUp({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: requestBody.username,
            Password: requestBody.password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: requestBody.email
                }
            ]
        }).promise();

        // Возвращаем успешный ответ с данными зарегистрированного пользователя
        return formatJSONResponse({
            message: 'User registration successful',
            user: {
                id: signUpResponse.UserSub, // Идентификатор пользователя в Cognito
                username: requestBody.username,
                email: requestBody.email
            }
        }, 200);
    } catch (error) {
        // В случае ошибки возвращаем сообщение об ошибке
        return formatJSONResponse({
            error: error.message || 'Failed to register user'
        }, 500);
    }
};

export const main = registerHandler;
