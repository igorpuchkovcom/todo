import {loginUser} from '../../../infrastructure/cognito';
import express, {Request, Response} from 'express';
import {formatJSONResponse} from "../../../libs/api-gateway";
import {checkRequiredFields} from "../../../helpers";

export const app = express();
app.use(express.json());

app.post('/auth/login', async (req: Request, res: Response) => {
    // Проверяем наличие обязательных полей в запросе
    const requiredFields = ['email', 'password'];
    if (!checkRequiredFields(req.body, requiredFields)) {
        // Возвращаем ошибку, если не все обязательные поля присутствуют в запросе
        return formatJSONResponse({error: 'Missing required fields'}, 400);
    }

    const {email, password} = req.body;
    try {
        const result = await loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
