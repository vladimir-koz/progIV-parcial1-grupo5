import Database from "better-sqlite3";

export function createDb(path: string = ':memory:'): Database.Database{
    return new Database(path);
}