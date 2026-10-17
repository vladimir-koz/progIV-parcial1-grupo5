import type { Pedido } from '../models/Pedido';
import { SqlitePedidoRepository } from '../repositories/PedidoRepository';

export class PedidoService {
    constructor(private readonly pedidos: SqlitePedidoRepository) {}

    listarPedidos(mesa?: number): Pedido[] {
        return this.pedidos.findAll(mesa);
    }
}