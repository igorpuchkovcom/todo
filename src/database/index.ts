import { MongoClient, ObjectId } from 'mongodb';

interface DatabaseConfig {
    databaseName: string;
    uri: string;
}

// Функция для вставки задачи в базу данных
export async function insertTaskIntoDatabase(taskData: { title: string, description: string }, config: DatabaseConfig): Promise<void> {
    const { databaseName, uri } = config;
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db(databaseName);
        const tasksCollection = database.collection('tasks');

        // Вставляем данные задачи в коллекцию tasks
        await tasksCollection.insertOne(taskData);
    } finally {
        // Всегда закрываем соединение с базой данных после завершения операции
        await client.close();
    }
}

// Функция для удаления задачи из базы данных
export async function deleteTaskFromDatabase(taskId: string, config: DatabaseConfig): Promise<void> {
    const { databaseName, uri } = config;
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db(databaseName);
        const tasksCollection = database.collection('tasks');

        // Создаем объект ObjectId из строки taskId
        const objectId = new ObjectId(taskId);

        // Удаляем задачу из коллекции по её идентификатору
        await tasksCollection.deleteOne({ _id: objectId });
    } finally {
        // Всегда закрываем соединение с базой данных после завершения операции
        await client.close();
    }
}
