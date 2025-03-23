// src/types/Appointment.ts
export interface Appointment {
    _id: string;
    date: string;
    costumer: {
      _id: string;
      displayName: string;
    };
    barberId: {
      _id: string;
      displayName: string;
    }
    status: string;
    service: string;
    isPaid: boolean;
  }
  