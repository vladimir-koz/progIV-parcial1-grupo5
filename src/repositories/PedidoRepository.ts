import type Database from 'better-sqlite3';
import type { NuevoPedido, Pedido } from '../models/Pedido';

export class SqlitePedidoRepository {
    constructor(private readonly db: Database.Database) {}

    create(_nuevo: NuevoPedido): Pedido {
        throw new Error('Repositorio pendiente de implementar');
    }

    findById(_id: number): Pedido | undefined {
        throw new Error('Repositorio pendiente de implementar');
    }
}