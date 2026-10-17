import type { Request, Response } from 'express';
import type { ReporteService } from '../services/ReporteService';

export class ReporteController {
    constructor(private readonly servicio: ReporteService) {}

    facturacion = (_req: Request, res: Response): void => {
        res.json({ total: this.servicio.facturacionTotal() });
    };
}