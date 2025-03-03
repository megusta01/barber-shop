import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../../styles/select.module.css";

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
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/searchUser?role=barber`);
        console.log('Resposta completa:', response);
        console.log('Dados da resposta:', response.data);
        
        // Garantindo que temos um array de barbeiros
        let barbersArray = [];
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data)) {
            barbersArray = response.data;
          } else if (Array.isArray(response.data.data)) {
            barbersArray = response.data.data;
          } else if (Array.isArray(response.data.users)) {
            barbersArray = response.data.users;
          }
        }
        
        console.log('Array de barbeiros processado:', barbersArray);
        setBarbers(barbersArray);
      } catch (err) {
        setError("Erro ao carregar os barbeiros.");
      } finally {
        setLoading(false);
      }
    }

    fetchBarbers();
  }, []);

  return (
    <div className={styles.selectContainer}>
      {loading ? (
        <p className={styles.loadingText}>Carregando barbeiros...</p>
      ) : error ? (
        <p className={styles.errorText}>{error}</p>
      ) : (
        <select 
          className={styles.select} 
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
