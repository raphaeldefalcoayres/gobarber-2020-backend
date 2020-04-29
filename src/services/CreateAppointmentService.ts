import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentRepository';
import AppError from '../errors/AppError';

/*
  Recebimento das informações
  Tratativa de errors e excessões
  Acesso ao repositório
*/

interface Request {
  provider_id: string;
  date: Date;
}

// Dependency Inversion

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppoinmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppoinmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
