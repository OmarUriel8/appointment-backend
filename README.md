# Appointment API

1. Clonar el proyecto
2. Instalar dependencias con `npm install`
3. Clonar el archivo `.env.template` y renombrarlo a `.env`
4. Cambiar las variables del entorno
5. Levantar la base de datos

```
docker-compose up -d
```

6. Ejecutar SEED, para llenar la base de datos

```
http://localhost:3000/api/seed
```

7. Levantar el desarrollo `npm run start:dev`

## Stack

- Nest
- Postgres
- Type ORM
