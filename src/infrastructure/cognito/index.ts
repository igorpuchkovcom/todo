import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";

const region = process.env.AWS_REGION || "us-east-1";
const cognitoClient = new CognitoIdentityProviderClient({ region: region });

export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const params = {
            ClientId: process.env.UserPoolClientId,
            Username: username,
            Password: password,
            UserAttributes: [
                { Name: "email", Value: email }
            ]
        };

        await cognitoClient.send(new SignUpCommand(params));
        return { message: "User successfully registered" };
    } catch (error) {
        throw new Error(error);
    }
};

export const confirmUser = async (code: string, username: string) => {
    try {
        const params = {
            ClientId: process.env.UserPoolClientId,
            ConfirmationCode: code,
            Username: username
        };

        await cognitoClient.send(new ConfirmSignUpCommand(params));
        return { message: "User successfully confirmed" };
    } catch (error) {
        throw new Error(error);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const params = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: process.env.UserPoolClientId,
            AuthParameters: {
                "USERNAME": email,
                "PASSWORD": password
            }
        };

        const response = await cognitoClient.send(new InitiateAuthCommand(params));
        // Обработка ответа и возврат необходимых данных о пользователе
        return { message: "User successfully logged in", data: response };
    } catch (error) {
        throw new Error(error);
    }
};
