import { Producto } from '../models/Producto';

export interface ProductoService {
  listarProductos(): Producto[];
  obtenerProducto(id: number): Producto | undefined;
}

export class ProductoServiceImpl implements ProductoService {
  constructor() {}

  listarProductos(): Producto[] {
    return []
  }

  obtenerProducto(id: number): Producto | undefined {
    return undefined;
  }
}
