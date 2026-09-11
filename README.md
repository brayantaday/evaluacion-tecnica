# HITSS - Modulo de Administracion

## Descripcion
Este proyecto implementa un modulo de administracion con frontend en Angular y backend en Laravel.

La aplicacion permite administrar:
- Usuarios
- Departamentos
- Cargos

El backend expone una API REST que el frontend consume para listar, crear, editar y eliminar registros. La interfaz fue construida con Angular Material y el backend usa Laravel con SQL Server.

## Arquitectura
- `frontend/`: aplicacion Angular 22
- `backend/`: API Laravel 13
- `docker-compose.yml`: orquestacion del backend y SQL Server
- `docker/backend/Dockerfile`: imagen PHP para Laravel

## Requisitos
### Generales
- Git
- Docker Desktop
- Docker Compose
- Node.js 24 o superior
- npm 11 o superior

### Backend
El backend corre dentro de Docker, por lo que no es obligatorio tener PHP o Composer instalados localmente.

### Frontend
El frontend corre localmente en Angular, fuera de Docker.

## Tecnologias principales
- Angular 22
- Angular Material
- Laravel 13
- PHP 8.4 en contenedor
- SQL Server 2022
- Docker Compose

## Puertos usados
- Frontend Angular: `http://localhost:4200`
- Backend Laravel: `http://localhost:8000`
- SQL Server: `localhost:1433`

## Configuracion actual del backend
Actualmente el backend esta configurado para usar SQL Server con estos valores:
- Base de datos: `prueba`
- Usuario: `sa`
- Password: `Prueba1234!`

Estos valores vienen de `docker-compose.yml` y `backend/.env`.

## Pasos para ejecutar el proyecto
### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Hitss
```

### 2. Levantar backend y base de datos
Desde la raiz del proyecto:
```bash
docker compose up --build -d
```

Esto levanta:
- El contenedor `laravel_backend`
- El contenedor `sqlserver_db`

### 3. Instalar dependencias del backend
Si es la primera vez que ejecutas el proyecto:
```bash
docker compose exec -T backend composer install
```

### 4. Configurar Laravel
El proyecto ya incluye un archivo `.env`, pero si necesitas regenerar la llave:
```bash
docker compose exec -T backend php artisan key:generate
```

### 5. Ejecutar migraciones
```bash
docker compose exec -T backend php artisan migrate --no-interaction
```

### 6. Cargar datos iniciales
```bash
docker compose exec -T backend php artisan db:seed --no-interaction
```

Esto carga seeders para:
- Departamentos
- Cargos
- Usuarios

### 7. Instalar dependencias del frontend
Desde la carpeta `frontend`:
```bash
npm install
```

Si en Windows PowerShell tienes restriccion con `npm.ps1`, puedes usar:
```bash
cmd.exe /c "C:\Progra~1\nodejs\npm.cmd --prefix c:\Users\Brayan\Documents\GitHub\Hitss\frontend install --no-audit --no-fund"
```

### 8. Ejecutar el frontend
Desde `frontend`:
```bash
npm start
```

Luego abre:
```text
http://localhost:4200
```

## Flujo de arranque recomendado
### Terminal 1 - Backend
Desde la raiz:
```bash
docker compose up -d
```

### Terminal 2 - Migraciones y seeders
Desde la raiz:
```bash
docker compose exec -T backend php artisan migrate --no-interaction
docker compose exec -T backend php artisan db:seed --no-interaction
```

### Terminal 3 - Frontend
Desde `frontend`:
```bash
npm start
```

## Endpoints principales de la API
Base URL:
```text
http://localhost:8000/api
```

### Usuarios
- `GET /usuarios`
- `POST /usuarios`
- `GET /usuarios/{id}`
- `PUT /usuarios/{id}`
- `DELETE /usuarios/{id}`

### Departamentos
- `GET /departamentos`
- `POST /departamentos`
- `GET /departamentos/{id}`
- `PUT /departamentos/{id}`
- `DELETE /departamentos/{id}`

### Cargos
- `GET /cargos`
- `POST /cargos`
- `GET /cargos/{id}`
- `PUT /cargos/{id}`
- `DELETE /cargos/{id}`

## Funcionalidad actual
### Frontend
- Vista de administracion con Angular Material
- CRUD de usuarios
- CRUD de departamentos
- CRUD de cargos
- Filtros por departamento y cargo
- Dialogos para crear y editar registros
- Retroalimentacion visual mientras se guardan cambios

### Backend
- API REST para usuarios, departamentos y cargos
- Migraciones para las tres entidades
- Seeders para datos iniciales
- Respuestas JSON preparadas para consumo desde Angular
- CORS habilitado para rutas `api/*`

## Comandos utiles
### Ver logs del backend
```bash
docker compose logs -f backend
```

### Ver logs de la base de datos
```bash
docker compose logs -f db
```

### Detener contenedores
```bash
docker compose down
```

### Reconstruir contenedores
```bash
docker compose up --build -d
```

### Build del frontend
```bash
npm run build
```

## Notas importantes
- El frontend consume la API en `http://localhost:8000/api`.
- El backend debe estar corriendo antes de usar el frontend.
- SQL Server puede tardar un poco en quedar listo la primera vez.
- Si las tablas no existen, ejecuta primero migraciones y luego seeders.
- En este momento el proyecto muestra warnings de presupuesto en el build del frontend, pero la aplicacion compila y funciona.

## Posibles mejoras
- Mover la URL de la API a archivos `environment`
- Agregar autenticacion y control de acceso
- Separar las pantallas Angular en componentes standalone mas pequenos
- Agregar validaciones visuales mas detalladas en los formularios
