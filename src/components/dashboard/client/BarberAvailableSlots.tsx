'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ScheduleModal from '../client/ScheduleModal';

interface AvailableSlot {
  date: string
}

interface BarberAvailableSlotsProps {
  barberId: string
}

const BarberAvailableSlots: React.FC<BarberAvailableSlotsProps> = ({ barberId }) => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    if (!barberId) {
      console.log("Erro: barberId não foi fornecido");
      return;
    }

    async function fetchAvailableSlots() {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.error("Erro: Token JWT não encontrado no localStorage");
        setError("Usuário não autenticado. Faça login novamente.");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/barberSchedule/${barberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );

        if (!res.data || !res.data.availability) {
          setError("Resposta inválida da API");
          return;
        }

        setAvailableSlots(
          res.data.availability.map((slot: any) => ({ date: slot }))
        );
      } catch (err: any) {
        setError(`Erro ao buscar os horários disponíveis: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableSlots();
  }, [barberId]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Horários Disponíveis</h2>
      {loading && <p>Carregando horários disponíveis...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && availableSlots.length === 0 && (
        <p>Nenhum horário disponível encontrado.</p>
      )}
      {!loading && !error && availableSlots.length > 0 && (
        <ul className="space-y-2">
          {availableSlots.map((slot, index) => (
            <li key={index} className="p-2 border border-gray-300 rounded flex justify-between items-center">
              {new Date(slot.date).toLocaleString('pt-BR', { timeZone: 'UTC' })}
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => { setSelectedSlot(slot); setShowModal(true); }}>
                Agendar
              </button>
            </li>
          ))}
        </ul>
      )}

      {showModal && selectedSlot && (
        <ScheduleModal 
          selectedSlot={selectedSlot} 
          barberId={barberId} 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default BarberAvailableSlots;
