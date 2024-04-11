import {getAllTasksFromDatabase} from '../../../infrastructure/database';
import config from '../../../../config/database-config';
import express, {Request, Response} from 'express';

export const app = express();

app.get('/tasks/get', async (_: Request, res: Response) => {
    try {
        const tasks = await getAllTasksFromDatabase(config);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});