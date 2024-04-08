import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {CognitoIdentityServiceProvider} from 'aws-sdk';
import {handleAuthentication, handleError} from '../helpers';

// Создаем экземпляр AWS SDK для работы с Cognito
const cognito = new CognitoIdentityServiceProvider();

// Обработчик для регистрации
export const registerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Вызываем вспомогательную функцию для обработки аутентификации
    return handleAuthentication(event, async (requestBody) => {
        try {
            // Регистрируем пользователя в Cognito
            const signUpResponse: CognitoIdentityServiceProvider.SignUpResponse = await cognito.signUp({
                ClientId: process.env.UserPoolClientId,
                Username: requestBody.username,
                Password: requestBody.password,
                UserAttributes: [{Name: 'email', Value: requestBody.email}]
            }).promise();

            // Формируем данные зарегистрированного пользователя
            const user = {
                id: signUpResponse.UserSub,
                username: requestBody.username,
                email: requestBody.email
            };

            // Возвращаем успешный ответ с данными зарегистрированного пользователя
            return formatJSONResponse({message: 'User registration successful', user}, 200);
        } catch (error) {
            // Обрабатываем ошибку регистрации
            return handleError(error);
        }
    });
};

export const main = registerHandler;
