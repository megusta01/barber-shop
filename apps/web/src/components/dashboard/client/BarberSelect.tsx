import { useEffect, useState } from "react";
import api from "@/services/api";

interface Barber {
  _id: string;
  displayName: string;
}

interface BarberSelectProps {
  onChange?: (barberId: string) => void;
  value?: string;
}

export default function BarberSelect({ onChange, value }: BarberSelectProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBarbers() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/users/searchUser?role=barber`);
        let barbersArray = [];

        if (response.data && typeof response.data === "object") {
          if (Array.isArray(response.data)) {
            barbersArray = response.data;
          } else if (Array.isArray(response.data.data)) {
            barbersArray = response.data.data;
          } else if (Array.isArray(response.data.users)) {
            barbersArray = response.data.users;
          }
        }

        setBarbers(barbersArray);
      } catch (err) {
        console.error("Erro ao carregar os barbeiros:", err);
        setError("Erro ao carregar os barbeiros.");
      } finally {
        setLoading(false);
      }
    }

    fetchBarbers();
  }, []);

  return (
    <div className="max-w-md mx-auto my-6">

      {loading ? (
        <p className="text-sm text-gray-500">Carregando barbeiros...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          onChange={(e) => onChange?.(e.target.value)}
          value={value}
        >
          <option value="">Selecione um barbeiro</option>
          {barbers.map((barber) => (
            <option key={barber._id} value={barber._id}>
              {barber.displayName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
