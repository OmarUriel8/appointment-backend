import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentStatus } from '../enum/appointment-status.enum';
import { User } from 'src/user/entities/user.entity';
import { EmployeeSchedule } from 'src/employee-schedule/entities/employee-schedule.entity';
import { Service } from 'src/service/entities';

@Entity({
  name: 'appointment',
})
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'time',
  })
  startTime: string;

  @Column({
    type: 'time',
  })
  endTime: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: 'text',
    default: '',
  })
  notes: string;

  @Column({
    type: 'text',
    default: '',
  })
  comments: string;

  @Column({
    type: 'float',
    default: 0,
  })
  score: number;

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

  @ManyToOne(() => User, (user) => user.appointmentsAsClient)
  client: User;

  @ManyToOne(() => User, (user) => user.appointmentsAsEmployee)
  employee: User;

  @ManyToOne(() => Service, (service) => service.appointments)
  service: Service;
}
