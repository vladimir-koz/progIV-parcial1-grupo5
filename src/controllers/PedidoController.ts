import type { Request, Response } from 'express';
import { PedidoService } from '../services/PedidoService';

export class PedidoController {
    constructor(private readonly servicio: PedidoService) {}

    listar = (req: Request, res: Response): void => {
        const mesa = req.query.mesa;

        if (typeof mesa === 'string') {
            res.json(this.servicio.listarPedidos(Number(mesa)));
            return;
        }

        res.json(this.servicio.listarPedidos());
    };
}