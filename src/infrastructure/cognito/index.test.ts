// Import the AWS SDK client and commands
import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
// Import the functions to test
import {confirmUser, loginUser, registerUser} from './index';

// Mock the AWS SDK methods
jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
    CognitoIdentityProviderClient: jest.fn(),
    SignUpCommand: jest.fn(),
    ConfirmSignUpCommand: jest.fn(),
    InitiateAuthCommand: jest.fn(),
    AuthFlowType: {
        USER_PASSWORD_AUTH: 'USER_PASSWORD_AUTH'
    }
}));

const username = 'testUser';
const email = 'test@example.com';
const password = 'password';
const code = '123456';

describe('Cognito Module', () => {
    let sendMock: jest.Mock;

    beforeEach(() => {
        sendMock = jest.fn();
        (CognitoIdentityProviderClient.prototype.send as jest.Mock) = sendMock; // Assign the 'send' method to the mock function
    });

    describe('registerUser', () => {
        it('should register a user successfully', async () => {
            const mockResponse = {};
            sendMock.mockResolvedValueOnce(mockResponse);

            const result = await registerUser(username, email, password);
            expect(result).toEqual({message: 'User successfully registered'});
            expect(sendMock).toHaveBeenCalledWith(expect.any(SignUpCommand));
        });

        it('should throw an error when registration fails', async () => {
            const errMsg = 'Registration failed';
            const error = new Error(errMsg);
            sendMock.mockRejectedValueOnce(error);

            await expect(registerUser(username, email, password)).rejects.toThrow(errMsg);
        });
    });

    describe('confirmUser', () => {
        it('should confirm a user successfully', async () => {
            const mockResponse = {};
            sendMock.mockResolvedValueOnce(mockResponse);

            const result = await confirmUser(code, username);
            expect(result).toEqual({message: 'User successfully confirmed'});
            expect(sendMock).toHaveBeenCalledWith(expect.any(ConfirmSignUpCommand));
        });

        it('should throw an error when confirmation fails', async () => {
            const errMsg = 'Confirmation failed';
            const error = new Error('Confirmation failed');
            sendMock.mockRejectedValueOnce(error);

            await expect(confirmUser(code, username)).rejects.toThrow(errMsg);
        });
    });

    describe('loginUser', () => {
        it('should login a user successfully', async () => {
            const mockResponse = {};
            sendMock.mockResolvedValueOnce(mockResponse);

            const result = await loginUser(email, password);
            expect(result).toEqual({message: 'User successfully logged in', data: mockResponse});
            expect(sendMock).toHaveBeenCalledWith(expect.any(InitiateAuthCommand));
        });

        it('should throw an error when login fails', async () => {
            const errMsg = 'Login failed';
            const error = new Error(errMsg);
            sendMock.mockRejectedValueOnce(error);

            await expect(loginUser(email, password)).rejects.toThrow(errMsg);
        });
    });
});
