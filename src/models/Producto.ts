import { Variedad } from "./Variedad";

export type Tamano = 'Pocillo'|'Mediano'|'Taza grande';

const GRAMOS_EXPRESO: Record<Tamano, number> = {
    'Pocillo': 18,
    'Mediano': 27,
    'Taza grande': 36,
};

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
        return this.precioBase + GRAMOS_EXPRESO[this.tamano] * this.variedad.precioPorGramo;
    }
}

const GRAMOS_FILTRADO: Record<Tamano, number> = {
    'Pocillo': 6,
    'Mediano': 15,
    'Taza grande': 25,
};

export class Filtrado extends Producto {
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
        return this.precioBase + GRAMOS_FILTRADO[this.tamano] * this.variedad.precioPorGramo;
    }
}

export class Pasteleria extends Producto {
    calcularPrecio(): number {
        return this.precioBase;
    }
}