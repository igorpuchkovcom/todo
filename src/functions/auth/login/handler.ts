import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {loginUser} from '../../../infrastructure/cognito';
import {formatJSONResponse} from '../../../libs/api-gateway';
import {handleAuthentication, handleError} from '../../../helpers';

export const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handleAuthentication(event, async (requestBody) => {
            try {
                // Получаем параметры из запроса
                const {email, password} = requestBody;

                // Пытаемся инициировать аутентификацию через Cognito
                const result = await loginUser(email, password);

                // Возвращаем успешный ответ
                return formatJSONResponse(result, 200);
            } catch (error) {
                // Обрабатываем ошибку подтверждения
                return handleError(error);
            }
        }
    )
};

export const main = loginHandler;
