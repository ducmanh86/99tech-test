import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  database: '99tech_test',
  type: 'mongodb',
  synchronize: true, // Note: Set to false in production
  url: process.env.MONGODB_URI,
  directConnection: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
});
