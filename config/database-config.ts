import { DatabaseConfig } from '../src/types/database';

const config: DatabaseConfig = {
    databaseName: 'todo',
    uri: 'mongodb://' + process.env.DocumentDBHost
};

export default config;