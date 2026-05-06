# Plan de Ejecución: Simulacro Examen Docker

**Objetivo:** Migrar los servicios de la empresa "DAWn of Development" (aplicación Node.js y base de datos MongoDB) a contenedores Docker.

A continuación, se detalla el plan de acción estructurado paso a paso para cumplir con todos los requisitos del examen.

---

## Fase 1: Preparación del Entorno (Aplicación Node.js)
Según el enunciado, el servicio Node debe generarse de una imagen llamada `it-crm:v0.1` (nota: Docker requiere que los nombres de las imágenes estén en minúsculas, por lo que se adaptará de `IT-CRM:v0.1` a `it-crm:v0.1`). Además, sabemos que existe un documento `package.json`. Esto indica que debemos construir la imagen nosotros mismos y crear el código fuente principal.

**Acciones a realizar:**
1. **Crear el archivo `app.js`:**
   - Desarrollar el archivo principal de la aplicación Node.js (`app.js`) que actuará como punto de entrada y contendrá la lógica de conexión a MongoDB.
2. **Crear un archivo `Dockerfile`** en la raíz del proyecto para la aplicación Node.js.
   - Utilizar una imagen base oficial de Node (por ejemplo, `node:18-alpine` o `node:latest`).
   - Establecer el directorio de trabajo (ej. `WORKDIR /app`).
   - Copiar el `package.json` y ejecutar `npm install` para instalar las dependencias.
   - Copiar el resto del código fuente al contenedor (incluyendo `app.js`).
   - Definir el comando de arranque de la aplicación (`CMD ["node", "app.js"]` o similar).
3. **Construir la imagen:**
   - La construcción se puede realizar manualmente con el comando: `docker build -t it-crm:v0.1 .`
   - O bien, se puede automatizar dentro del `docker-compose.yaml` utilizando las opciones `build` e `image`.

---

## Fase 2: Configuración de Orquestación (`docker-compose.yaml`)
Se debe crear y configurar el archivo `docker-compose.yaml` respetando estrictamente las reglas definidas en las actividades.

**Acciones a realizar:**
1. **Definir los Servicios:**
   - **Servicio Backend (Node):**
     - Indicar que utilice la imagen `it-crm:v0.1`.
     - Cumplir la regla de nombrar el contenedor principal como `DoD` utilizando la directiva `container_name: DoD`.
   - **Servicio Base de Datos (MongoDB):**
     - Utilizar la imagen oficial de Mongo (ej. `mongo:latest`).
2. **Configurar Credenciales de MongoDB:**
   - Para que el usuario sea `root` con la contraseña indicada, se deben añadir las siguientes variables de entorno (`environment`) al servicio de MongoDB:
     - `MONGO_INITDB_ROOT_USERNAME: root`
     - `MONGO_INITDB_ROOT_PASSWORD: DoD_CRM_DATABASE_25`
3. **Configurar la Red Interna:**
   - Declarar una red personalizada al final del archivo `docker-compose.yaml` llamada `DoD-CRM-NETWORK`.
   - Asignar esta red a los dos servicios (Node y MongoDB) para que puedan comunicarse entre sí.
4. **Configurar la Persistencia de Datos:**
   - Para que la información de la BD sea independiente del contenedor, se debe declarar un volumen en el servicio de MongoDB.
   - Mapear el volumen local a la ruta donde MongoDB guarda los datos internamente (habitualmente `/data/db`).

---

## Fase 3: Verificación y Pruebas
Una vez configurado todo, es vital realizar una comprobación del correcto funcionamiento.

**Acciones a realizar:**
1. Levantar el entorno ejecutando: `docker-compose up -d --build`.
2. Verificar que los contenedores (especialmente el llamado `DoD`) estén corriendo mediante `docker ps`.
3. Comprobar que ambos servicios estén en la red correcta mediante `docker network inspect DoD-CRM-NETWORK`.
4. Verificar la persistencia de datos (opcionalmente) reiniciando el contenedor de Mongo y confirmando que no hay pérdida de información.
