"use client";

import { Request, RequestGroup } from "@/types/request.type";
import { memo } from "react";
import { useRequestContext } from "./RequestContext";
import { Heart, Trash2 } from "lucide-react";
import { PrayButton } from "./PrayButton";

type CardInnerProps = {
  group: RequestGroup;
  isCollapsed: boolean;
  handleCollapse: (userId: number) => void;
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
};

export const RequestCard = memo(function RequestCard(props: CardInnerProps) {
  return <ListCard {...props} />;
});

export function StackCard({
  group,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: CardInnerProps) {
  const { getIsPrayedUser } = useRequestContext();
  const isFav =
    !!group.requests[0] && getIsFavoriteRequest(group.requests[0].requestId);

  return (
    <div
      className="rounded-3xl p-4 w-full h-full flex flex-col"
      style={{
        background: "hsl(var(--background) / 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid hsl(var(--border) / 0.3)",
      }}
    >
      {/* 카드 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h3
            style={{
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              fontSize: "1rem",
            }}
          >
            {group.name}
          </h3>
          <span
            style={{
              fontSize: "0.75rem",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            {group.cellId}조 · {group.gisu}기
          </span>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (group.requests[0])
              toggleFavoriteRequest(group.requests[0].requestId);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: isFav ? "hsl(0 72% 55% / 0.1)" : "transparent" }}
        >
          <Heart
            className={`w-4 h-4 ${isFav ? "text-red-400 fill-red-400" : "text-muted-foreground/40"}`}
          />
        </button>
      </div>

      {/* 기도제목 리스트 */}
      <div className="space-y-2 flex-1">
        {group.requests.map((request) => (
          <RequestItem
            key={request.requestId}
            request={request}
            toggleFavoriteRequest={toggleFavoriteRequest}
            getIsFavoriteRequest={getIsFavoriteRequest}
            hideDelete
          />
        ))}
      </div>

      {/* 기도체크 버튼 */}
      <div className="flex justify-center mt-1">
        <PrayButton
          targetUserId={group.userId}
          initialIsChecked={getIsPrayedUser(group.userId)}
        />
      </div>
    </div>
  );
}

export function ListCard({
  group,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: CardInnerProps) {
  const isFav =
    !!group.requests[0] && getIsFavoriteRequest(group.requests[0].requestId);

  return (
    <div className="glass rounded-2xl p-4 pt-2">
      {/* 카드 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {group.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {group.cellId}조
          </span>
        </div>
        <button
          onClick={() => {
            if (group.requests[0])
              toggleFavoriteRequest(group.requests[0].requestId);
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: isFav ? "hsl(0 72% 55% / 0.1)" : "transparent" }}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isFav ? "text-red-400 fill-red-400" : "text-muted-foreground/30"}`}
          />
        </button>
      </div>

      {/* 기도제목 리스트 */}
      <div className="space-y-1.5">
        {group.requests.map((request) => (
          <RequestItemList key={request.requestId} request={request} />
        ))}
      </div>
    </div>
  );
}

function RequestItem({
  request,
  hideDelete = false,
}: {
  request: Request;
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
  hideDelete?: boolean;
}) {
  const { handleDeleteRequest, isMyRequestGroup } = useRequestContext();
  const isMyRequest = isMyRequestGroup(request.userId);

  return (
    <div className="glass rounded-2xl p-3 flex items-start gap-2">
      <p className="text-sm text-foreground leading-relaxed flex-1">
        {request.text}
      </p>
      {isMyRequest && !hideDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRequest(request.requestId);
          }}
          className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted active:scale-90 transition-transform shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground/50" />
        </button>
      )}
    </div>
  );
}

function RequestItemList({ request }: { request: Request }) {
  const { handleDeleteRequest, isMyRequestGroup } = useRequestContext();
  const isMyRequest = isMyRequestGroup(request.userId);

  return (
    <div className="flex items-start gap-2">
      <p className="text-sm text-foreground leading-relaxed flex-1">
        {request.text}
      </p>
      {isMyRequest && (
        <button
          onClick={() => handleDeleteRequest(request.requestId)}
          className="p-1 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground/30" />
        </button>
      )}
    </div>
  );
}
