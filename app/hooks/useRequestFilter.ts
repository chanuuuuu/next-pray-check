"use client";

import { useState, useMemo, useCallback } from "react";
import { Request } from "@/types/request.type";
import { REQUEST_GROUP_OPTIONS } from "@/app/utils/constants";

export function useRequestFilter(
  requests: Request[],
  cellId: number,
  favoriteRequests: number[]
) {
  const [selectedRequestType, setSelectedRequestType] = useState<number>(
    REQUEST_GROUP_OPTIONS.TEAM.value
  );

  const conditionalRequests = useMemo(() => {
    switch (selectedRequestType) {
      case REQUEST_GROUP_OPTIONS.TEAM.value:
        return requests;
      case REQUEST_GROUP_OPTIONS.CELL.value:
        return requests.filter((request) => request.cellId === cellId);
      case REQUEST_GROUP_OPTIONS.FAVORITE.value:
        return requests.filter((request) =>
          favoriteRequests.includes(request.requestId)
        );
    }
    return requests;
  }, [requests, selectedRequestType, cellId, favoriteRequests]);

  const handleRequestTypeChange = useCallback((value: number) => {
    setSelectedRequestType(value);
  }, []);

  return { selectedRequestType, conditionalRequests, handleRequestTypeChange };
}
