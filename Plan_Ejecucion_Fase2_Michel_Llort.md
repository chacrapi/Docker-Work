# Plan de Ejecución: Fase 2 - Migración a Flask y PostgreSQL

**Objetivo:** Adaptar la entrega anterior (Node.js + MongoDB) para que la aplicación utilice tecnología Flask (Python) en el backend y PostgreSQL como base de datos relacional.

A continuación, se detallan los cambios específicos que se deberán realizar en la estructura y en los archivos del proyecto.

---

## 1. Modificación de los Archivos de la Aplicación (Python/Flask)

El entorno de Node.js (`app.js` y `package.json`) será reemplazado por un entorno de Python.

### Creación de `requirements.txt`
Se eliminará el `package.json` y se creará un archivo `requirements.txt` para gestionar las dependencias de Python.
**Cambios:**
- Añadir `Flask` para el servidor web.
- Añadir `psycopg2-binary` (o `psycopg2`) y opcionalmente `SQLAlchemy` para poder conectarse e interactuar con la base de datos PostgreSQL.

### Creación de `app.py`
Se reemplazará `app.js` por `app.py`, que será el nuevo punto de entrada de la aplicación.
**Cambios:**
- Importar `Flask` y configurar la aplicación principal (`app = Flask(__name__)`).
- Configurar la cadena de conexión (URI) para PostgreSQL utilizando las credenciales definidas en el `docker-compose.yaml` (ej. `postgresql://root:DoD_CRM_DATABASE_25@postgres_db:5432/crm`).
- Crear las rutas necesarias (ej. la ruta raíz `/`) que devuelvan la respuesta de la aplicación y manejen la conexión a la base de datos.
- Configurar el servidor para que escuche en el puerto `5000` (el puerto estándar de Flask) y sea accesible desde fuera del contenedor estableciendo `host='0.0.0.0'`.

---

## 2. Actualización de los Archivos de Docker

Los archivos encargados de construir y orquestar los contenedores deben adaptarse a las nuevas tecnologías.

### Modificación del `Dockerfile`
El contenedor de la aplicación ya no utilizará Node.js, sino Python.
**Cambios específicos:**
- **Imagen base:** Cambiar de `node:18-alpine` a una imagen de Python, como `python:3.10-slim`.
- **Dependencias:** Reemplazar `COPY package.json ./` y `RUN npm install` por `COPY requirements.txt .` y el comando `RUN pip install --no-cache-dir -r requirements.txt`.
- **Código fuente:** Copiar los archivos (`COPY . .`) que ahora incluirán el nuevo `app.py`.
- **Puerto:** Cambiar `EXPOSE 3000` por `EXPOSE 5000`.
- **Comando de inicio:** Cambiar `CMD ["npm", "start"]` a `CMD ["python", "app.py"]` (o alternativamente usar el comando `flask run`).

### Modificación del `docker-compose.yaml`
Se debe actualizar la orquestación para levantar PostgreSQL en lugar de MongoDB y configurar el servicio de Flask.
**Cambios específicos en el Servicio Backend (DoD):**
- Actualizar el nombre de la imagen a algo representativo (ej. `it-crm-flask:v0.1`).
- Cambiar el mapeo de puertos de `"3000:3000"` a `"5000:5000"`.
- Cambiar la dependencia (`depends_on`) apuntando al nuevo servicio de PostgreSQL.

**Cambios específicos en el Servicio de Base de Datos:**
- Cambiar la imagen base de `mongo:latest` a `postgres:15` (o la versión deseada).
- Renombrar el contenedor y el servicio, por ejemplo a `postgres_db`.
- **Variables de entorno:** Cambiar las variables de Mongo por las equivalentes en PostgreSQL:
  - `POSTGRES_USER: root`
  - `POSTGRES_PASSWORD: DoD_CRM_DATABASE_25`
  - `POSTGRES_DB: crm`
- **Puertos:** Cambiar el puerto `27017:27017` por el estándar de PostgreSQL `"5432:5432"`.
- **Volúmenes:** Actualizar la ruta interna del volumen para que apunte a donde PostgreSQL guarda los datos (cambiar `/data/db` a `/var/lib/postgresql/data`).

---

## 3. Verificación
Una vez realizados los cambios, el comando de despliegue seguirá siendo el mismo:
```bash
docker-compose up -d --build
```
Se verificará mediante `docker ps` que los contenedores están activos y accediendo a `http://localhost:5000` para comprobar que el entorno Flask con PostgreSQL funciona correctamente.
