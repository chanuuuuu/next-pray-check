"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { actionRequestDelete } from "@/app/action/requestAction";
import { useRouter } from "next/navigation";

// RequestContextType - 컨텍스트 구조
interface RequestContextType {
  deletedRequests: Set<number>;
  handleDeleteRequest: (requestId: number) => Promise<void>;
  isMyRequestGroup: (groupUserId: number) => boolean;
}

// createContext<RequestContextType> - 컨텍스트 생성 및 초기값 선언
const RequestContext = createContext<RequestContextType>({
  deletedRequests: new Set(),
  handleDeleteRequest: async () => {},
  isMyRequestGroup: () => false,
});

// ContextProvider 생성
export function RequestContextProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: number;
}) {
  const router = useRouter();

  const [deletedRequests, setDeletedRequests] = useState<Set<number>>(
    new Set()
  );

  const handleDeleteRequest = useCallback(
    async (requestId: number) => {
      if (confirm("해당 기도제목을 삭제하시겠습니까?")) {
        setDeletedRequests((prev) => new Set([...prev, requestId]));
        try {
          const result = await actionRequestDelete(requestId);
          if (!result) router.refresh();
        } catch {
          setDeletedRequests((prev) => {
            const newSet = new Set(prev);
            newSet.delete(requestId);
            return newSet;
          });
        }
      }
    },
    [router]
  );

  const isMyRequestGroup = useCallback(
    (groupUserId: number) => {
      return groupUserId === userId;
    },
    [userId]
  );

  // ✅ useMemo로 value 객체 메모이제이션
  const value = useMemo(
    () => ({
      deletedRequests,
      handleDeleteRequest,
      isMyRequestGroup,
    }),
    [deletedRequests, handleDeleteRequest, isMyRequestGroup]
  );

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
}

// useContext() wrapper 함수
export function useRequestContext() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error(
      "useRequestContext는 RequestContextProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
}
