'use client'
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  displayName: string;
}

export default function getUserNameFromToken(): string | null {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("Token JWT não encontrado no localStorage");
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.displayName ||  null;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

