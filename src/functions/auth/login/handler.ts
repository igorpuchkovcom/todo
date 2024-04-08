import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {CognitoIdentityServiceProvider} from 'aws-sdk';
import {handleAuthentication, handleError} from '../helpers';

// Создаем экземпляр AWS SDK для работы с Cognito
const cognito = new CognitoIdentityServiceProvider();

// Обработчик для входа
export const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Вызываем вспомогательную функцию для обработки аутентификации
    return handleAuthentication(event, async (requestBody) => {
        try {
            // Пытаемся инициировать аутентификацию через Cognito
            const signInResponse = await cognito.initiateAuth({
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: process.env.UserPoolClientId,
                AuthParameters: {
                    USERNAME: requestBody.email,
                    PASSWORD: requestBody.password
                }
            }).promise();

            // Получаем токен аутентификации
            const token = signInResponse.AuthenticationResult?.AccessToken;

            // Возвращаем успешный ответ с токеном
            return formatJSONResponse({message: 'Login successful', token}, 200);
        } catch (error) {
            // Обрабатываем ошибку аутентификации
            if (error.code === 'NotAuthorizedException') {
                return formatJSONResponse({error: 'Invalid credentials'}, 401);
            }
            // Возвращаем ошибку сервера в других случаях
            return handleError(error);
        }
    });
};

export const main = loginHandler;
