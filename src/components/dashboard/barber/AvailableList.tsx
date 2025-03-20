// src/components/AvailableSlotsList.tsx
import React from 'react';

interface AvailableSlotsListProps {
  schedule: { availability: string[] } | null;
}

const AvailableSlotsList: React.FC<AvailableSlotsListProps> = ({ schedule }) => {
  if (!schedule || schedule.availability.length === 0) return null;

  return (
    <div className="bg-gray-100 p-3 rounded-md mt-4">
      <h3 className="text-lg font-semibold">Horários Disponíveis</h3>
      <ul>
        {schedule.availability.map((slot, index) => (
          <li key={index} className="text-gray-700">
            {new Date(slot).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableSlotsList;
