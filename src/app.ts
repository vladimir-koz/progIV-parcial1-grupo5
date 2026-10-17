import express from 'express';
import type Database from 'better-sqlite3';

export function makeApp(_db: Database.Database) {
    const app = express();
    app.use(express.json());
    return app;
}