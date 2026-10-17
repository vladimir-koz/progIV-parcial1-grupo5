import express from 'express';
import type Database from 'better-sqlite3';
import { SqlitePedidoRepository } from './repositories/PedidoRepository';
import { PedidoService } from './services/PedidoService';
import { makePedidosRouter } from './routes/pedidos';
import { SqliteProductoRepository } from './repositories/ProductoRepository';
import { ProductoServiceImpl } from './services/ProductoService';
import { makeProductosRouter } from './routes/productos';

export function makeApp(db: Database.Database) {
    const app = express();
    app.use(express.json());
    const productoRepo = new SqliteProductoRepository(db);

  
    const productoService = new ProductoServiceImpl(productoRepo);
    const repositorio = new SqlitePedidoRepository(db);
    const servicio = new PedidoService(repositorio);

    app.get('/health', (_req, res) => res.json({ status: 'ok' }));

    app.use('/productos', makeProductosRouter(productoService));
    app.use('/pedidos', makePedidosRouter(servicio));

    return app;
}