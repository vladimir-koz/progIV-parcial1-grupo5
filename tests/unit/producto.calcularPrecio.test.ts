import { describe, expect, it } from 'vitest';
import { Expreso } from '../../src/models/Producto';
import { Variedad } from '../../src/models/Variedad';

const brasil: Variedad = {
    id: 1,
    nombre: 'Brasil',
    precioPorGramo: 140,
    acidez: 'baja',
    cuerpo: 'denso',
    notas: 'avellana'
};

describe('Expreso.calcularPrecio', () => {
    it('calcula el precio del Pocillo Brasil', () => {
        const expreso = new Expreso(1, 'Expreso Pocillo Brasil', 2500, 'Pocillo', brasil);
        expect(expreso.calcularPrecio()).toBe(5020);
    });

    it('calcula el precio del Mediano Brasil', () => {
        const expreso = new Expreso(2, 'Expreso Mediano Brasil', 2500, 'Mediano', brasil);
        expect(expreso.calcularPrecio()).toBe(6280);
    });
});import { describe, expect, it } from 'vitest';
import { Expreso } from '../../src/models/Producto';
import { Variedad } from '../../src/models/Variedad';

const brasil: Variedad = {
    id: 1,
    nombre: 'Brasil',
    precioPorGramo: 140,
    acidez: 'baja',
    cuerpo: 'denso',
    notas: 'avellana'
};

describe('Expreso.calcularPrecio', () => {
    it('calcula el precio del Pocillo Brasil', () => {
        const expreso = new Expreso(1, 'Expreso Pocillo Brasil', 2500, 'Pocillo', brasil);
        expect(expreso.calcularPrecio()).toBe(5020);
    });

    it('calcula el precio del Mediano Brasil', () => {
        const expreso = new Expreso(2, 'Expreso Mediano Brasil', 2500, 'Mediano', brasil);
        expect(expreso.calcularPrecio()).toBe(6280);
    });
});