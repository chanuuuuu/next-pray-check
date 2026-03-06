"use client";

import { memo } from "react";
import { Request } from "@/types/request.type";
import { RequestListView } from "./RequestListView";
import { RequestStackView } from "./RequestStackView";

type RequestGridProps = {
  requests: Request[];
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
  isStackView: boolean;
};

export const RequestGrid = memo(function RequestGrid({
  requests,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
  isStackView,
}: RequestGridProps) {
  if (isStackView) {
    return (
      <RequestStackView
        requests={requests}
        toggleFavoriteRequest={toggleFavoriteRequest}
        getIsFavoriteRequest={getIsFavoriteRequest}
      />
    );
  }

  return (
    <RequestListView
      requests={requests}
      toggleFavoriteRequest={toggleFavoriteRequest}
      getIsFavoriteRequest={getIsFavoriteRequest}
    />
  );
});
