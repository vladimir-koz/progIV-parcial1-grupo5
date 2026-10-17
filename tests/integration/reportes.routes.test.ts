import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { makeReportesRouter } from '../../src/routes/reportes';
import type { ReporteService } from '../../src/services/ReporteService';

describe('GET /reportes/facturacion', () => {
    it('devuelve la facturación calculada por el servicio', async () => {
        const servicio: ReporteService = {
            facturacionTotal: () => 7500,
            cantidadVendidaPorTipo: () => ({}),
            tipoMasVendido: () => undefined
        };

        const app = express();
        app.use('/reportes', makeReportesRouter(servicio));

        const respuesta = await request(app).get('/reportes/facturacion');

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({ total: 7500 });
    });
});