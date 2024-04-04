import { main } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Register API Endpoint', () => {
    it('should return success response on valid input', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                username: 'testUser',
                email: 'test@example.com',
                password: 'testPassword'
            }),
            path: '/api/auth/register',
            httpMethod: 'POST',
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            headers: {},
            multiValueHeaders: null,
            isBase64Encoded: false,
            requestContext: null,
            resource: ''
        };

        const response = await main(event);

        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toEqual('User registration successful');
        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toHaveProperty('id');
        expect(responseBody.user).toHaveProperty('username', 'testUser');
        expect(responseBody.user).toHaveProperty('email', 'test@example.com');
    });

    it('should return error response when required fields are missing', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                username: 'testUser',
                email: 'test@example.com'
            }),
            path: '/api/auth/register',
            httpMethod: 'POST',
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            headers: {},
            multiValueHeaders: null,
            isBase64Encoded: false,
            requestContext: null,
            resource: ''
        };

        const response = await main(event);

        expect(response.statusCode).toEqual(400);
        expect(typeof response.body).toEqual('string');
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toEqual('Missing required fields');
    });
});
