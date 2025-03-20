import { useEffect, useState } from "react";
import api from "@/services/api";
import styles from "@/styles/admin.module.css";

interface User {
  _id: string;
  displayName: string;
  email: string;
  role: "CLIENT" | "BARBER" | "ADMIN";
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem('refreshToken')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "BARBER" ? "CLIENT" : "BARBER";

    if (!window.confirm(`Deseja alterar a role deste usuário para ${newRole}?`)) {
      return;
    }

    try {
      await api.patch(`/users/${userId}`,
        { role: newRole },
      );

      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar a role.");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Painel de Administração</h2>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => toggleRole(user._id, user.role)}
                      className={styles.toggleButton}
                    >
                      Tornar {user.role === "BARBER" ? "Cliente" : "Barbeiro"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
