import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceImage } from './service-image.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity({
  name: 'service',
})
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column({
    type: 'int',
    default: '30',
  })
  durationMinutes: number;

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments?: Appointment[];

  @OneToMany(() => ServiceImage, (serviceImage) => serviceImage.service, {
    eager: true,
    cascade: true,
  })
  images?: ServiceImage[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
  }

  @BeforeUpdate()
  checkfieldBeforeUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
