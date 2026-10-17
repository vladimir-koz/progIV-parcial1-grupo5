import type { NuevoPedido,Pedido } from '../models/Pedido';
import { SqlitePedidoRepository } from '../repositories/PedidoRepository';

export class PedidoService {
    constructor(private readonly pedidos: SqlitePedidoRepository) {}

    listarPedidos(mesa?: number): Pedido[] {
        return this.pedidos.findAll(mesa);
    }
    obtenerPedido(id: number): Pedido | undefined {
        return this.pedidos.findById(id);
    }
    crearPedido(nuevo: NuevoPedido): Pedido {
    return this.pedidos.create(nuevo);
}
}