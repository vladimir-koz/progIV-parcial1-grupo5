import { Router } from 'express';
import type { ReporteService } from '../services/ReporteService';

export function makeReportesRouter(_servicio: ReporteService) {
    return Router();
}