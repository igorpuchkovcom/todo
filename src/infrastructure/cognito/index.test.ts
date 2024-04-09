import { confirmUser, loginUser, registerUser } from './index';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Определим переменную failedPromise
const failedPromise = jest.fn().mockRejectedValueOnce(new Error('Test error'));

jest.mock('aws-sdk', () => {
    const mockConfirmSignUp = jest.fn().mockImplementation(() => ({ promise: jest.fn() })) as jest.Mock;
    const mockInitiateAuth = jest.fn().mockImplementation(() => ({ promise: jest.fn() })) as jest.Mock;
    const mockSignUp = jest.fn().mockImplementation(() => ({ promise: jest.fn() })) as jest.Mock;

    return {
        CognitoIdentityServiceProvider: jest.fn(() => ({
            confirmSignUp: mockConfirmSignUp,
            initiateAuth: mockInitiateAuth,
            signUp: mockSignUp,
        })),
    };
});

describe('Cognito Infrastructure Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('confirmUser', () => {
        it('should confirm user successfully', async () => {
            const result = await confirmUser('123456', 'testUser');
            expect(result).toEqual({ message: 'User confirmed successfully' });
        });

        it('should throw error when confirmation fails', async () => {
            const mockConfirmSignUp = CognitoIdentityServiceProvider.prototype.confirmSignUp as jest.Mock;
            mockConfirmSignUp.mockReturnValue({ promise: failedPromise });

            await expect(confirmUser('invalidCode', 'testUser')).rejects.toThrowError('Test error');
        });
    });

    describe('loginUser', () => {
        it('should login user successfully', async () => {
            const result = await loginUser('test@example.com', 'testPassword');
            expect(result).toEqual({ message: 'Login successful', token: 'mocked_access_token' });
        });

        it('should throw error when login fails', async () => {
            const mockInitiateAuth = CognitoIdentityServiceProvider.prototype.initiateAuth as jest.Mock;
            mockInitiateAuth.mockReturnValue({ promise: failedPromise });

            await expect(loginUser('test@example.com', 'wrongPassword')).rejects.toThrowError('Test error');
        });

        it('should return error message when login fails with NotAuthorizedException', async () => {
            const mockInitiateAuth = CognitoIdentityServiceProvider.prototype.initiateAuth as jest.Mock;
            mockInitiateAuth.mockReturnValue({ promise: failedPromise });

            const result = await loginUser('test@example.com', 'wrongPassword');
            expect(result).toEqual({ error: 'Invalid credentials' });
        });
    });

    describe('registerUser', () => {
        it('should register user successfully', async () => {
            const result = await registerUser('testUser', 'test@example.com', 'testPassword');
            expect(result).toEqual({
                message: 'User registration successful',
                user: { id: '123456789', username: 'testUser', email: 'test@example.com' },
            });
        });

        it('should throw error when registration fails', async () => {
            const mockSignUp = CognitoIdentityServiceProvider.prototype.signUp as jest.Mock;
            mockSignUp.mockReturnValue({ promise: failedPromise });

            await expect(registerUser('testUser', 'test@example.com', 'testPassword')).rejects.toThrowError('Test error');
        });
    });
});
