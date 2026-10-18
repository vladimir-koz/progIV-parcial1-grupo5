import type { NuevoPedido,Pedido } from '../models/Pedido';
import { SqlitePedidoRepository } from '../repositories/PedidoRepository';
import type { ProductoService } from './ProductoService';

export class PedidoService {
    constructor(private readonly pedidos: SqlitePedidoRepository,private readonly productos: ProductoService) {}

    listarPedidos(mesa?: number): Pedido[] {
        return this.pedidos.findAll(mesa);
    }
    obtenerPedido(id: number): Pedido | undefined {
        return this.pedidos.findById(id);
    }
    crearPedido(nuevo: NuevoPedido): Pedido & { total: number } {
        const total = nuevo.items.reduce((suma, item) => {
            const producto = this.productos.obtenerProducto(item.productoId);
            if (producto === undefined) {
                throw new Error('Producto inexistente');
            }
            return suma + producto.calcularPrecio() * item.cantidad;
        }, 0);

        const pedido = this.pedidos.create(nuevo);
        return { ...pedido, total };
    }
}