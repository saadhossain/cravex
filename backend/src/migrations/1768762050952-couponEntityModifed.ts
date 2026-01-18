import { MigrationInterface, QueryRunner } from "typeorm";

export class CouponEntityModifed1768762050952 implements MigrationInterface {
    name = 'CouponEntityModifed1768762050952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupons" ADD "menuItemId" uuid`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD CONSTRAINT "FK_0339ae688535749d3e3ebc6ab4a" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupons" DROP CONSTRAINT "FK_0339ae688535749d3e3ebc6ab4a"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "menuItemId"`);
    }

}
