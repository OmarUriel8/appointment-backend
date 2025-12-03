import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceImages1764696442661 implements MigrationInterface {
    name = 'ServiceImages1764696442661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "serviceId" uuid, CONSTRAINT "PK_25c780834f7ebf269233974cc8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "service_image" ADD CONSTRAINT "FK_fcec9d53526e892907f95ea1cfb" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_image" DROP CONSTRAINT "FK_fcec9d53526e892907f95ea1cfb"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "imageUrl" text NOT NULL`);
        await queryRunner.query(`DROP TABLE "service_image"`);
    }

}
