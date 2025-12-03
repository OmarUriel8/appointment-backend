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
  npm run migration:generate
  npm run migration:run
```

se agregaron los scripts

```
  "migration:generate": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/config/typeorm.config.ts ./src/database/migrations/migration",
  "migration:create": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create -d ./src/config/typeorm.config.ts ./src/database/migrations/migration",
  "migration:run": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/config/typeorm.config.ts",
  "migration:revert": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./src/config/typeorm.config.ts"
```

se agrego archivo **typeorm.config.ts**
y se agrego libreria **dotenv y typeorm**

## Stack

- Nest
- Postgres
- Type ORM

```

```
