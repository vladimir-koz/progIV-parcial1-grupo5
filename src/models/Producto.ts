import { Variedad } from "./Variedad";

export type Tamano = 'Pocillo' | 'Mediano' | 'Taza grande';
export type TipoProducto = 'expreso' | 'filtrado' | 'pasteleria';

const GRAMOS_EXPRESO: Record<Tamano, number> = {
    'Pocillo': 18,
    'Mediano': 27,
    'Taza grande': 36,
};

const GRAMOS_FILTRADO: Record<Tamano, number> = {
    'Pocillo': 6,
    'Mediano': 15,
    'Taza grande': 25,
};

export abstract class Producto {
    abstract readonly tipo: TipoProducto;

    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly precioBase: number
    ) {}

    abstract calcularPrecio(): number;
}

abstract class Cafe extends Producto {
    constructor(
        id: number,
        nombre: string,
        precioBase: number,
        readonly tamano: Tamano,
        readonly variedad: Variedad
    ) {
        super(id, nombre, precioBase);
    }

    protected abstract gramos(): number;

    calcularPrecio(): number {
        return this.precioBase + this.gramos() * this.variedad.precioPorGramo;
    }
}

export class Expreso extends Cafe {
    readonly tipo = 'expreso' as const;

    protected gramos(): number {
        return GRAMOS_EXPRESO[this.tamano];
    }
}

export class Filtrado extends Cafe {
    readonly tipo = 'filtrado' as const;

    protected gramos(): number {
        return GRAMOS_FILTRADO[this.tamano];
    }
}

export class Pasteleria extends Producto {
    readonly tipo = 'pasteleria' as const;

    calcularPrecio(): number {
        return this.precioBase;
    }
}
