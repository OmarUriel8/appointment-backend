import { MigrationInterface, QueryRunner } from "typeorm";

export class Service1764693848551 implements MigrationInterface {
    name = 'Service1764693848551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "slug" text NOT NULL, "price" double precision NOT NULL, "imageUrl" text NOT NULL, "durationMinutes" integer NOT NULL DEFAULT '30', "tags" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name"), CONSTRAINT "UQ_4df47ef659e04d5be78ddb6b598" UNIQUE ("slug"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service"`);
    }

}
