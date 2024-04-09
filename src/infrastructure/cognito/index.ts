import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { formatJSONResponse } from '../../libs/api-gateway';
import { handleError } from '../../helpers';

const cognito = new CognitoIdentityServiceProvider();

export async function confirmUser(code: string, username: string): Promise<any> {
    try {
        await cognito.confirmSignUp({
            ClientId: process.env.UserPoolClientId,
            ConfirmationCode: code,
            Username: username
        }).promise();

        return { message: 'User confirmed successfully' };
    } catch (error) {
        throw handleError(error);
    }
}

export async function loginUser(email: string, password: string): Promise<any> {
    try {
        const signInResponse = await cognito.initiateAuth({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.UserPoolClientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        }).promise();

        const token = signInResponse.AuthenticationResult?.AccessToken;

        return { message: 'Login successful', token };
    } catch (error) {
        if (error.code === 'NotAuthorizedException') {
            return formatJSONResponse({ error: 'Invalid credentials' }, 401);
        }
        throw handleError(error);
    }
}

export async function registerUser(username: string, email: string, password: string): Promise<any> {
    try {
        const signUpResponse = await cognito.signUp({
            ClientId: process.env.UserPoolClientId,
            Username: username,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }]
        }).promise();

        const user = {
            id: signUpResponse.UserSub,
            username,
            email
        };

        return { message: 'User registration successful', user };
    } catch (error) {
        throw handleError(error);
    }
}
