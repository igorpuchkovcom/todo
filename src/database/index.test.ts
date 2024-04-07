import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { insertTaskIntoDatabase } from './index';

describe('insertTaskIntoDatabase', () => {
    let mongoServer: MongoMemoryServer;
    let mongoClient: MongoClient;
    let mongoUri: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
    });

    afterAll(async () => {
        await mongoClient.close();
        await mongoServer.stop();
    });

    it('should insert task into the database', async () => {
        const taskData = { title: 'Test Task', description: 'This is a test task' };
        const config = { databaseName: 'test', uri: mongoUri };

        await insertTaskIntoDatabase(taskData, config);

        const database = mongoClient.db(config.databaseName);
        const tasksCollection = database.collection('tasks');
        const insertedTask = await tasksCollection.findOne({ title: 'Test Task' });

        expect(insertedTask).toBeTruthy();
        expect(insertedTask.title).toEqual(taskData.title);
        expect(insertedTask.description).toEqual(taskData.description);
    });
});
