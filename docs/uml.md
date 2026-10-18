# Diagramas UML — Cafetería Origen API

Diagramas en [Mermaid](https://mermaid.js.org/): GitHub y VS Code (con la
extensión *Markdown Preview Mermaid Support*) los muestran renderizados.

1. [Diagrama de clases — Modelo de dominio](#1-diagrama-de-clases--modelo-de-dominio)
2. [Diagrama de clases — Capas de la aplicación](#2-diagrama-de-clases--capas-de-la-aplicación)
3. [Diagrama de componentes / paquetes](#3-diagrama-de-componentes--paquetes)
4. [Modelo de datos (SQLite)](#4-modelo-de-datos-sqlite)
5. [Secuencia — `POST /pedidos`](#5-secuencia--post-pedidos)
6. [Secuencia — `GET /reportes/mas-vendido`](#6-secuencia--get-reportesmas-vendido)
7. [Secuencia — Arranque (`makeApp`)](#7-secuencia--arranque-makeapp)

---

## 1. Diagrama de clases — Modelo de dominio

`Producto` es abstracta y cada subclase implementa `calcularPrecio()`
(polimorfismo). `Cafe` agrega tamaño y variedad; `Expreso` y `Filtrado` solo
definen los gramos por tamaño.

```mermaid
classDiagram
    direction TB

    class Producto {
        <<abstract>>
        +tipo: TipoProducto
        +id: number
        +nombre: string
        +precioBase: number
        +calcularPrecio() number*
        +toJSON() Record~string, unknown~
    }

    class Cafe {
        <<abstract>>
        #gramosPorTamano: Record~Tamano, number~
        +tamano: Tamano
        +variedad: Variedad
        +gramos: number
        +calcularPrecio() number
        +toJSON() Record~string, unknown~
    }

    class Expreso {
        +tipo = "expreso"
        #gramosPorTamano = Pocillo 18, Mediano 27, Taza grande 36
    }

    class Filtrado {
        +tipo = "filtrado"
        #gramosPorTamano = Pocillo 6, Mediano 15, Taza grande 25
    }

    class Pasteleria {
        +tipo = "pasteleria"
        +calcularPrecio() number
    }

    class Variedad {
        <<interface>>
        +id: number
        +nombre: string
        +precioPorGramo: number
        +acidez: string
        +cuerpo: string
        +notas: string
    }

    class TipoProducto {
        <<enumeration>>
        expreso
        filtrado
        pasteleria
    }

    class Tamano {
        <<enumeration>>
        Pocillo
        Mediano
        Taza grande
    }

    class Pedido {
        <<interface>>
        +id: number
        +items: ItemPedido[]
        +estado: EstadoPedido
    }

    class NuevoPedido {
        <<interface>>
        +items: ItemPedido[]
        +estado?: EstadoPedido
    }

    class PedidoConTotal {
        <<interface>>
        +total: number
    }

    class ItemPedido {
        <<interface>>
        +productoId: number
        +cantidad: number
    }

    class EstadoPedido {
        <<enumeration>>
        pendiente
        en_preparacion
        entregado
    }

    Producto <|-- Cafe
    Producto <|-- Pasteleria
    Cafe <|-- Expreso
    Cafe <|-- Filtrado
    Cafe "*" --> "1" Variedad : variedad
    Cafe ..> Tamano
    Producto ..> TipoProducto

    Pedido <|-- PedidoConTotal
    Pedido "1" *-- "1..*" ItemPedido : items
    NuevoPedido "1" *-- "1..*" ItemPedido : items
    Pedido ..> EstadoPedido
    ItemPedido ..> Producto : productoId
```

**Cálculo de precio:**

- `Cafe.calcularPrecio() = precioBase + gramos × variedad.precioPorGramo`
- `Pasteleria.calcularPrecio() = precioBase`
- `PedidoConTotal.total = Σ producto.calcularPrecio() × item.cantidad` (no se persiste)

---

## 2. Diagrama de clases — Capas de la aplicación

Cada capa depende de **interfaces** de la capa de abajo; `makeApp` es la
única que conoce las implementaciones concretas (inyección por constructor).
`ReporteService` se apoya en los servicios, no en los repositorios.

```mermaid
classDiagram
    direction TB

    %% ---------- Controllers ----------
    class ProductoController {
        -service: ProductoService
        +list(req, res)
        +getById(req, res)
    }
    class PedidoController {
        -service: PedidoService
        +create(req, res)
        +list(req, res)
        +getById(req, res)
    }
    class ReporteController {
        -service: ReporteService
        +facturacion(req, res)
        +cantidadVendida(req, res)
        +masVendido(req, res)
    }

    %% ---------- Services ----------
    class ProductoService {
        <<interface>>
        +listarProductos() Producto[]
        +obtenerProducto(id) Producto | undefined
    }
    class PedidoService {
        <<interface>>
        +crearPedido(data: NuevoPedido) PedidoConTotal
        +listarPedidos() PedidoConTotal[]
        +obtenerPedido(id) PedidoConTotal | undefined
    }
    class ReporteService {
        <<interface>>
        +facturacionTotal() number
        +cantidadVendidaPorProducto() Record~string, number~
        +productoMasVendido() ProductoMasVendido | undefined
    }

    class ProductoServiceImpl {
        -repo: ProductoRepository
    }
    class PedidoServiceImpl {
        -pedidos: PedidoRepository
        -productos: ProductoRepository
        -conTotal(pedido: Pedido) PedidoConTotal
    }
    class ReporteServiceImpl {
        -pedidos: PedidoService
        -productos: ProductoService
        -ventasPorProducto() ProductoMasVendido[]
    }

    class ProductoInexistenteError {
        +productoId: number
    }
    class ProductoMasVendido {
        <<interface>>
        +productoId: number
        +nombre: string
        +cantidad: number
    }

    %% ---------- Repositories ----------
    class ProductoRepository {
        <<interface>>
        +findAll() Producto[]
        +findById(id) Producto | undefined
    }
    class PedidoRepository {
        <<interface>>
        +create(data: NuevoPedido) Pedido
        +findAll() Pedido[]
        +findById(id) Pedido | undefined
        +clear() void
    }
    class SqliteProductoRepository {
        -db: Database
    }
    class SqlitePedidoRepository {
        -db: Database
        -rowToPedido(row) Pedido
    }

    class Database {
        <<better-sqlite3>>
    }

    ProductoController --> ProductoService
    PedidoController --> PedidoService
    ReporteController --> ReporteService

    ProductoService <|.. ProductoServiceImpl
    PedidoService <|.. PedidoServiceImpl
    ReporteService <|.. ReporteServiceImpl

    ProductoServiceImpl --> ProductoRepository
    PedidoServiceImpl --> PedidoRepository
    PedidoServiceImpl --> ProductoRepository
    ReporteServiceImpl --> PedidoService
    ReporteServiceImpl --> ProductoService

    PedidoServiceImpl ..> ProductoInexistenteError : «throws»
    PedidoController ..> ProductoInexistenteError : «catches»
    ReporteService ..> ProductoMasVendido
    Error <|-- ProductoInexistenteError

    ProductoRepository <|.. SqliteProductoRepository
    PedidoRepository <|.. SqlitePedidoRepository
    SqliteProductoRepository --> Database
    SqlitePedidoRepository --> Database
```

---

## 3. Diagrama de componentes / paquetes

```mermaid
flowchart TB
    client([Cliente HTTP<br/>curl · Postman · Playwright])

    subgraph app["app.ts — makeApp(dbPath)"]
        direction TB
        subgraph routes["routes/"]
            rProd["makeProductosRouter<br/>/productos"]
            rPed["makePedidosRouter<br/>/pedidos"]
            rRep["makeReportesRouter<br/>/reportes"]
        end
        subgraph controllers["controllers/ (validación Zod + códigos HTTP)"]
            cProd[ProductoController]
            cPed[PedidoController]
            cRep[ReporteController]
        end
        subgraph services["services/ (reglas de negocio)"]
            sProd[ProductoServiceImpl]
            sPed[PedidoServiceImpl]
            sRep[ReporteServiceImpl]
        end
        subgraph repos["repositories/ (SQL → modelos)"]
            repProd[SqliteProductoRepository]
            repPed[SqlitePedidoRepository]
        end
        models[["models/<br/>Producto · Variedad · Pedido"]]
        db[("db/connection.ts<br/>createDb() + seed")]
    end

    sqlite[("SQLite<br/>data/cafeteria.sqlite<br/>o :memory:")]

    client --> rProd & rPed & rRep
    rProd --> cProd --> sProd --> repProd
    rPed --> cPed --> sPed
    sPed --> repPed
    sPed --> repProd
    rRep --> cRep --> sRep
    sRep --> sPed
    sRep --> sProd
    repProd & repPed --> db --> sqlite
    repProd -. instancia .-> models
    sPed -. usa .-> models
```

---

## 4. Modelo de datos (SQLite)

`productos.tamano` y `productos.variedadId` son `NULL` para pastelería. El
total del pedido **no** es una columna: se calcula al leer.

```mermaid
erDiagram
    VARIEDADES {
        INTEGER id PK
        TEXT nombre UK
        INTEGER precioPorGramo
        TEXT acidez
        TEXT cuerpo
        TEXT notas
    }
    PRODUCTOS {
        INTEGER id PK
        TEXT tipo "expreso | filtrado | pasteleria"
        TEXT nombre UK
        INTEGER precioBase
        TEXT tamano "NULL en pasteleria"
        INTEGER variedadId FK "NULL en pasteleria"
    }
    PEDIDOS {
        INTEGER id PK
        TEXT estado "default pendiente"
    }
    PEDIDO_ITEMS {
        INTEGER pedidoId FK "ON DELETE CASCADE"
        INTEGER productoId FK
        INTEGER cantidad "CHECK > 0"
    }

    VARIEDADES |o--o{ PRODUCTOS : "origen de"
    PEDIDOS ||--|{ PEDIDO_ITEMS : contiene
    PRODUCTOS ||--o{ PEDIDO_ITEMS : "se vende en"
```

---

## 5. Secuencia — `POST /pedidos`

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant R as pedidos router
    participant PC as PedidoController
    participant PS as PedidoServiceImpl
    participant PrR as SqliteProductoRepository
    participant PeR as SqlitePedidoRepository
    participant DB as SQLite

    C->>R: POST /pedidos { items, estado? }
    R->>PC: create(req, res)
    PC->>PC: createSchema.safeParse(req.body)

    alt body inválido
        PC-->>C: 400 { error: "ValidationError", details }
    else body válido
        PC->>PS: crearPedido(data)
        loop por cada item
            PS->>PrR: findById(productoId)
            PrR->>DB: SELECT ... LEFT JOIN variedades
            PrR-->>PS: Producto | undefined
        end

        alt algún producto no existe
            PS--xPC: throw ProductoInexistenteError
            PC-->>C: 400 { error: "ProductoInexistente", productoId }
        else todos existen
            PS->>PeR: create(data)
            activate PeR
            PeR->>DB: BEGIN
            PeR->>DB: INSERT INTO pedidos
            PeR->>DB: INSERT INTO pedido_items (× n)
            PeR->>DB: COMMIT
            PeR-->>PS: Pedido
            deactivate PeR

            Note over PS: conTotal(pedido)
            loop por cada item
                PS->>PrR: findById(productoId)
                PrR-->>PS: Producto (Expreso | Filtrado | Pasteleria)
                PS->>PS: total += producto.calcularPrecio() × cantidad
            end
            PS-->>PC: PedidoConTotal
            PC-->>C: 201 { id, items, estado, total }
        end
    end
```

---

## 6. Secuencia — `GET /reportes/mas-vendido`

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant RC as ReporteController
    participant RS as ReporteServiceImpl
    participant PS as PedidoService
    participant PrS as ProductoService

    C->>RC: GET /reportes/mas-vendido
    RC->>RS: productoMasVendido()
    RS->>RS: ventasPorProducto()
    RS->>PS: listarPedidos()
    PS-->>RS: PedidoConTotal[]
    Note over RS: acumula cantidad por productoId<br/>y ordena por id ascendente
    loop por cada producto vendido
        RS->>PrS: obtenerProducto(productoId)
        PrS-->>RS: Producto (para el nombre)
    end
    Note over RS: reduce → mayor cantidad<br/>(empate: gana el de menor id)
    RS-->>RC: ProductoMasVendido | undefined

    alt sin ventas
        RC-->>C: 404 { error: "SinVentas" }
    else hay ventas
        RC-->>C: 200 { productoId, nombre, cantidad }
    end
```

---

## 7. Secuencia — Arranque (`makeApp`)

Muestra la composición de dependencias (*composition root*).

```mermaid
sequenceDiagram
    autonumber
    participant S as server.ts
    participant A as makeApp(dbPath?)
    participant DB as createDb(path)

    S->>A: makeApp()
    A->>A: resolvedPath = dbPath ?? (NODE_ENV=test ? ":memory:" : "data/cafeteria.sqlite")
    A->>DB: createDb(resolvedPath)
    DB->>DB: CREATE TABLE IF NOT EXISTS ×4
    opt tabla productos vacía
        DB->>DB: seedCatalogo(): 3 variedades + 20 productos (transacción)
    end
    DB-->>A: Database

    A->>A: new SqliteProductoRepository(db)
    A->>A: new SqlitePedidoRepository(db)
    A->>A: new ProductoServiceImpl(productoRepo)
    A->>A: new PedidoServiceImpl(pedidoRepo, productoRepo)
    A->>A: new ReporteServiceImpl(pedidoService, productoService)
    A->>A: app.use('/productos' | '/pedidos' | '/reportes', routers)

    opt NODE_ENV = test
        A->>A: POST /__test__/reset y /__test__/seed
    end

    A-->>S: express app
    S->>S: listen(PORT = 3000)
```
