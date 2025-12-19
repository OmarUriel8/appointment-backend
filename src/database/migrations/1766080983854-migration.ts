import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766080983854 implements MigrationInterface {
    name = 'Migration1766080983854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "nameService" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "durationMinutes" integer NOT NULL DEFAULT '30'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "durationMinutes"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "nameService"`);
    }

}
