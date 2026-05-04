# Proyecto Cursos CEICEC

Aplicación web para gestión de cursos.

- Backend: Flask + SQLAlchemy
- Frontend: React + Vite
- Base de datos: PostgreSQL

## Requisitos

- Python 3.8+
- Node.js 20+
- npm
- PostgreSQL 12+

## Instalación Rápida

### 1) Clonar y entrar al proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd cursos-ceicec
```

### 2) Backend (Python)

```bash
python3 -m venv myenv
source myenv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3) Base de datos (PostgreSQL)

En PostgreSQL, crea la base y usuario de ejemplo:

```sql
CREATE DATABASE proyecto3;
CREATE USER dun WITH PASSWORD 'dun';
GRANT ALL PRIVILEGES ON DATABASE proyecto3 TO dun;
```

La conexión actual en el backend está definida en `app.py` así:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://dun:dun@localhost:5432/proyecto3'
```

Si usas otro usuario, contraseña o base de datos, ajusta esa línea.

### 4) Frontend (Node)

```bash
cd front
npm install
cd ..
```

## Verificación de instalación

### Backend

```bash
source myenv/bin/activate
python -c "import flask, flask_sqlalchemy, flask_jwt_extended, marshmallow, psycopg2, bcrypt; print('backend_ok')"
```

### Frontend

```bash
cd front
npm run dev
```

## Notas importantes

- `requirements.txt` fue limpiado para contener solo dependencias reales del backend.
- Si ejecutas `npm run build`, pueden aparecer errores TypeScript existentes del proyecto. Eso no bloquea la instalación ni `npm run dev`.

## Estructura general

```text
cursos-ceicec/
├── app.py
├── modelo.py
├── routes/
├── requirements.txt
└── front/
    ├── package.json
    └── src/
```

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit.
4. Haz push y abre un Pull Request.

## Documentación adicional

https://docs.google.com/document/d/1-daMFTLHqx5m-tWQP8anNn1RbHiHkLybJYm0zhrtxLY/edit?tab=t.0