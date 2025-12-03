import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPassword1764620198005 implements MigrationInterface {
    name = 'UserPassword1764620198005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "pasword" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "password" TO "pasword"`);
    }

}
