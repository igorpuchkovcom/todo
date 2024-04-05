import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Создаем экземпляр AWS SDK для работы с Cognito
const cognito = new CognitoIdentityServiceProvider();

// Обработчик для API endpoint
const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestBody = JSON.parse(event.body);

    // Проверяем, правильность переданных учетных данных
    try {
        const signInResponse: CognitoIdentityServiceProvider.InitiateAuthResponse = await cognito.initiateAuth({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: requestBody.email,
                PASSWORD: requestBody.password
            }
        }).promise();

        // Проверяем наличие свойства AuthenticationResult
        const token = signInResponse.AuthenticationResult?.AccessToken;

        // Если аутентификация успешна, возвращаем успешный ответ с токеном
        return formatJSONResponse({
            message: 'Login successful',
            token: token
        }, 200);
    } catch (error) {
        // Если аутентификация не удалась из-за неправильных учетных данных, возвращаем ошибку с кодом 401
        if (error.code === 'NotAuthorizedException') {
            return formatJSONResponse({
                error: 'Invalid credentials'
            }, 401);
        }

        // Возвращаем общую ошибку сервера в других случаях
        return formatJSONResponse({
            error: 'Server error'
        }, 500);
    }
};

export const main = loginHandler;
