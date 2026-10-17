import { Pedido } from '../models/Pedido';

export type TipoProducto = 'expreso' | 'filtrado' | 'pasteleria';

export interface PedidoConTotal extends Pedido {
  total: number;
}

export interface FuentePedidos {
  listarPedidos(): PedidoConTotal[];
}

export interface FuenteProductos {
  obtenerProducto(id: number): { tipo: TipoProducto } | undefined;
}

export interface ReporteService {
  facturacionTotal(): number;
}

// Los reportes reutilizan los servicios de pedidos y productos.
export class ReporteServiceImpl implements ReporteService {
  constructor(
    private readonly pedidos: FuentePedidos,
    private readonly productos: FuenteProductos
  ) {}

  // Suma todos los pedidos registrados, independientemente de su estado.
  facturacionTotal(): number {
    return this.pedidos.listarPedidos().reduce((suma, pedido) => suma + pedido.total, 0);
  }
}