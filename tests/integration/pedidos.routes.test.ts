import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';
import { createDb } from '../../src/db/connection';
import { SqlitePedidoRepository } from '../../src/repositories/PedidoRepository';

describe('GET /pedidos', () => {
    it('devuelve solamente los pedidos de la mesa solicitada', async () => {
        const db = createDb(':memory:');

        try {
            const repositorio = new SqlitePedidoRepository(db);
            const primero = repositorio.create({
                mesa: 7,
                items: [{ productoId: 19, cantidad: 1 }]
            });
            repositorio.create({
                mesa: 4,
                items: [{ productoId: 19, cantidad: 1 }]
            });
            const segundo = repositorio.create({
                mesa: 7,
                items: [{ productoId: 19, cantidad: 2 }]
            });
            repositorio.create({
                items: [{ productoId: 19, cantidad: 1 }]
            });

            const respuesta = await request(makeApp(db)).get('/pedidos?mesa=7');

            expect(respuesta.status).toBe(200);
            expect(respuesta.body).toMatchObject([
                { id: primero.id, mesa: 7 },
                { id: segundo.id, mesa: 7 }
            ]);
        } finally {
            db.close();
        }
    });
});