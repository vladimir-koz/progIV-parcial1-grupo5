import { Variedad } from "./Variedad";

export type Tamano = 'Pocillo'|'Mediano'|'Taza grande';

export abstract class Producto {
    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly precioBase: number
    ) {}

    abstract calcularPrecio(): number;
}
export class Expreso extends Producto {
    constructor(
        id: number,
        nombre: string,
        precioBase: number,
        readonly tamano: Tamano,
        readonly variedad: Variedad
    ) {
        super(id, nombre, precioBase);
    }

    calcularPrecio(): number {
        throw new Error('Precio pendiente de implementar');
    }
}