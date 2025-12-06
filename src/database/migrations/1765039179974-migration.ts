import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765039179974 implements MigrationInterface {
    name = 'Migration1765039179974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "comments" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "score" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "comments"`);
    }

}
