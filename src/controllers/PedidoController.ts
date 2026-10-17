import type { Request, Response } from 'express';
import { PedidoService } from '../services/PedidoService';

export class PedidoController {
    constructor(private readonly servicio: PedidoService) {}

    listar = (req: Request, res: Response): void => {
        const mesaTexto = req.query.mesa;

        if (mesaTexto === undefined) {
            res.json(this.servicio.listarPedidos());
            return;
        }

        if (typeof mesaTexto !== 'string') {
            res.status(400).json({ error: 'DatosInvalidos' });
            return;
        }

        const mesa = Number(mesaTexto);

        if (!Number.isSafeInteger(mesa) || mesa <= 0) {
            res.status(400).json({ error: 'DatosInvalidos' });
            return;
        }

        res.json(this.servicio.listarPedidos(mesa));
    };
    obtenerPorId = (req: Request, res: Response): void => {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            res.status(400).json({ error: 'DatosInvalidos' });
            return;
        }

        const pedido = this.servicio.obtenerPedido(id);

        if (pedido === undefined) {
            res.status(404).json({ error: 'NoEncontrado' });
            return;
        }

        res.json(pedido);
    };
}