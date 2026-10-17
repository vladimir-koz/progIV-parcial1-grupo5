import { Router } from 'express';
import { ReporteController } from '../controllers/ReporteController';
import type { ReporteService } from '../services/ReporteService';

export function makeReportesRouter(servicio: ReporteService) {
    const router = Router();
    const controlador = new ReporteController(servicio);

    router.get('/facturacion', controlador.facturacion);

    return router;
}