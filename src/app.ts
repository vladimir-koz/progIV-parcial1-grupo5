import express from 'express';
import type Database from 'better-sqlite3';
import { SqlitePedidoRepository } from './repositories/PedidoRepository';
import { PedidoService } from './services/PedidoService';
import { makePedidosRouter } from './routes/pedidos';

export function makeApp(db: Database.Database) {
    const app = express();
    app.use(express.json());

    const repositorio = new SqlitePedidoRepository(db);
    const servicio = new PedidoService(repositorio);
    app.use('/pedidos', makePedidosRouter(servicio));

    return app;
}