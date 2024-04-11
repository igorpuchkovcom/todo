import {deleteTaskFromDatabase} from '../../../infrastructure/database';
import config from '../../../../config/database-config';
import express, {Request, Response} from 'express';

export const app = express();

app.delete('/tasks/delete/:id', async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        await deleteTaskFromDatabase(taskId, config);
        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
