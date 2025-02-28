# Proyecto Cursos CEICEC

Este proyecto es una aplicación web desarro`enter code here`llada con  **Flask**  en el backend y  **Node.js**  en el frontend. Proporciona una plataforma para gestionar cursos y está diseñada para ser fácil de instalar y ejecutar.

----------

## Tabla de Contenidos

1.  Requisitos
    
2.  Instalación
    
    -   Backend (Flask)
        
    -   Base de Datos (PostgreSQL)
        
    -   Frontend (Node.js)
        
3.  Ejecución
    
4.  Estructura del Proyecto
    
5.  Contribución
    
6.  Licencia
    

----------

## Requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

-   **Python 3+**
    
-   **PostgreSQL**
    
-   **Node.js 16+**
    
-   **npm**  (viene con Node.js)
    
-   **pip**  (gestor de paquetes de Python)
    

----------

## Instalación

### Backend (Flask)

1.  **Instalar Python y pip**:
    
    bash
    
    Copy
    
    sudo apt update
    sudo apt install python3 python3-pip
    
2.  **Crear y activar un entorno virtual**:
    
    bash
    
    Copy
    
    python3 -m venv myenv
    source myenv/bin/activate  # Linux/macOS
    
3.  **Instalar dependencias de Flask**:  
    Navega a la carpeta del proyecto y ejecuta:
    
    bash
    
    Copy
    
    cd proyectogustavo
    pip install -r requirements.txt
    
4.  **Configurar la base de datos**:
    
    -   Instala PostgreSQL:
        
        bash
        
        Copy
        
        sudo apt install postgresql postgresql-contrib
        
    -   Crea un usuario y una base de datos en PostgreSQL.
        
    -   Configura las credenciales de la base de datos en el archivo  `app.py`.
        

----------

### Base de Datos (PostgreSQL)

1.  **Crear un usuario y una base de datos**:
    
    bash
    
    Copy
    
    sudo -u postgres psql
    CREATE DATABASE ceicec_db;
    CREATE USER ceicec_user WITH PASSWORD 'tu_contraseña';
    GRANT ALL PRIVILEGES ON DATABASE ceicec_db TO ceicec_user;
    \q
    
2.  **Configurar la conexión en  `app.py`**:  
    Asegúrate de que el archivo  `app.py`  tenga la configuración correcta para conectarse a la base de datos:
    
    python
    
    Copy
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://ceicec_user:tu_contraseña@localhost/ceicec_db'
    

----------

### Frontend (Node.js)

1.  **Instalar Node.js y npm**:
    
    bash
    
    Copy
    
    sudo apt install curl -y
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
2.  **Instalar dependencias del frontend**:  
    Navega a la carpeta  `front`  y ejecuta:
    
    bash
    
    Copy
    
    cd front
    npm install
    

----------

## Ejecución

### Backend

1.  **Activar el entorno virtual**:
    
    bash
    
    Copy
    
    source myenv/bin/activate
    
2.  **Ejecutar la aplicación Flask**:
    
    bash
    
    Copy
    
    flask run
    
    La aplicación estará disponible en  `http://127.0.0.1:5000`.
    

### Frontend

1.  **Navegar a la carpeta  `front`**:
    
    bash
    
    Copy
    
    cd front
    
2.  **Iniciar el servidor de desarrollo**:
    
    bash
    
    Copy
    
    npm run dev
    
    El frontend estará disponible en  `http://localhost:3000`.
    

----------

## Estructura del Proyecto

Copy

proyectogustavo/

│   ├── __init__.py
│   ├── query.sql
│   ├── app.py
│   ├── routes/
│   ├── models.py
│   ├── modelo.py
│   └── requeriments.txt
├── front/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── requirements.txt
├── app.py
└── README.md

----------

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1.  Haz un fork del repositorio.
    
2.  Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
    
3.  Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
    
4.  Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
    
5.  Abre un Pull Request.
    

----------

¡Gracias por usar el Proyecto Cursos CEICEC! Si tienes alguna pregunta, no dudes en abrir un issue en el repositorio.