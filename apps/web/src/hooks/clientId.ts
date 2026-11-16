'use client'
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
}

export default function useClientId(): string | null {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("Token JWT não encontrado no localStorage");
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.id ||  null;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

