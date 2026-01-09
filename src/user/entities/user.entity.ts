import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { EmployeeSchedule } from '@/employee-schedule/entities/employee-schedule.entity';
import { Appointment } from '@/appointment/entities/appointment.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    default: '',
  })
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

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

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    () => EmployeeSchedule,
    (employeeSchedule) => employeeSchedule.employee,
  )
  employeeSchedule?: EmployeeSchedule[];

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointmentsAsClient?: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.employee)
  appointmentsAsEmployee?: Appointment[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
