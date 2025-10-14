import { useState, useEffect } from "react";
import {
  actionAddFavoriteRequest,
  actionDeleteFavoriteRequest,
} from "@/app/action/requestAction";

interface UseFavoriteRequestProps {
  userId: number;
  initialFavoriteRequests: number[];
}

export function useFavoriteRequest({
  userId,
  initialFavoriteRequests,
}: UseFavoriteRequestProps) {
  const [favoriteRequests, setFavoriteRequests] = useState<number[]>([]);

  useEffect(() => {
    setFavoriteRequests(initialFavoriteRequests);
  }, [initialFavoriteRequests]);

  // 낙관적 업데이트
  async function handleAddFavoriteRequest(requestId: number) {
    setFavoriteRequests((prev) => [...prev, requestId]);
    const result = await actionAddFavoriteRequest(requestId, userId);
    if (!result) {
      setFavoriteRequests((prev) => prev.filter((id) => id !== requestId));
    }
  }

  async function handleDeleteFavoriteRequest(requestId: number) {
    setFavoriteRequests((prev) => prev.filter((id) => id !== requestId));
    const result = await actionDeleteFavoriteRequest(requestId, userId);
    if (!result) {
      setFavoriteRequests((prev) => [...prev, requestId]);
    }
  }

  function toggleFavoriteRequest(requestId: number) {
    if (favoriteRequests.includes(requestId)) {
      handleDeleteFavoriteRequest(requestId);
    } else {
      handleAddFavoriteRequest(requestId);
    }
  }

  function getIsFavoriteRequest(requestId: number): boolean {
    return favoriteRequests.includes(requestId);
  }

  return {
    favoriteRequests,
    toggleFavoriteRequest,
    getIsFavoriteRequest,
  };
}
