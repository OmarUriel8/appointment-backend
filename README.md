# Appointment API

1. Clonar el proyecto
2. Instalar dependencias con `npm install`
3. Clonar el archivo `.env.template` y renombrarlo a `.env`
4. Cambiar las variables del entorno
5. Levantar la base de datos

```
docker-compose up -d
```

6. Crear base de datos

```
  npm run build
  npm run migrate:run
```

7. Ejecutar SEED, para llenar la base de datos

```
http://localhost:3000/api/seed
```

8. Levantar el desarrollo `npm run start:dev`

## Hacer migraciones

1. Crear buil para que genere los archivos de las entidades
2. Generar migracion importante la ruta ya que el archivo de configuracion datasourde.ts usa esta ruta
3. Ejecutar migracion

```
  npm run build
  NAME=test npm run migration:generate
  npm run migration:run
```

se agregaron los scripts

```
"typeorm": "ts-node -r dotenv/config -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource ./datasource.ts",
"migration:generate": "npm run typeorm -- migration:generate ./database/migrations/$NAME",
"migration:run": "npm run typeorm -- migration:run",
"migration:revert": "npm run typeorm -- migration:revert"
```

se agrego archivo **datasource.ts**
y se agrego libreria **dotenv y typeorm**

## Stack

- Nest
- Postgres
- Type ORM

```

```
