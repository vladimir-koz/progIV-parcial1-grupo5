import { describe, expect, it } from 'vitest';
import { createDb } from '../../src/db/connection';
import { SqlitePedidoRepository } from '../../src/repositories/PedidoRepository';

describe('SqlitePedidoRepository', () => {
    it('crea y recupera un pedido sin mesa con un item', () => {
        const db = createDb(':memory:');

        try {
            const repositorio = new SqlitePedidoRepository(db);
            const creado = repositorio.create({
                items: [{ productoId: 19, cantidad: 2 }]
        });

        expect(creado).toEqual({
            id: 1,
            mesa: null,
            items: [{ productoId: 19, cantidad: 2 }],
            estado: 'pendiente'
        });

        expect(repositorio.findById(1)).toEqual(creado);
        } finally {
        db.close();
        }
    });
});