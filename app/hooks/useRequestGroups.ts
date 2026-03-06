"use client";

import { useMemo, useState, useCallback } from "react";
import { Request, RequestGroup } from "@/types/request.type";
import { useRequestContext } from "@/app/component/Request/RequestContext";

export function useRequestGroups(requests: Request[]) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set(),
  );
  const { deletedRequests } = useRequestContext();

  const handleCollapse = useCallback((userId: number) => {
    setCollapsedGroups((prev: Set<number>) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const requestGroups = useMemo(() => {
    return requests.reduce((arr, request) => {
      if (deletedRequests.has(request.requestId)) return arr;
      const group = arr.find((group) => group.userId === request.userId);
      if (!group) {
        arr.push({
          userId: request.userId,
          name: request.name,
          gisu: request.gisu,
          cellId: request.cellId,
          requests: [request],
        });
      } else {
        group.requests.push(request);
      }
      return arr;
    }, [] as RequestGroup[]);
  }, [requests, deletedRequests]);

  return { requestGroups, collapsedGroups, handleCollapse };
}
