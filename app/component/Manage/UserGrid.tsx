import { User } from "@/types/user.type";
import { LEVEL_OPTIONS } from "@/app/utils/constants";
import { getBirthDisplay } from "@/app/utils/clientUtils";
import { getCells } from "@/app/utils/clientUtils";
import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";

type UserGridProps = {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
};

function getLevelLabel(level: number): string {
  const levelOption = Object.values(LEVEL_OPTIONS).find((option) => option.value === level);
  return levelOption ? levelOption.label : "";
}

export const TeamGrid = memo(function TeamGrid({ users, onEdit, onDelete }: UserGridProps) {
  const cells = getCells(users);

  return (
    <section className="space-y-5">
      {cells.map((cell) => (
        <div key={cell.cellId}>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-1">
            {cell.cellId}조{cell.leaderName ? ` (${cell.leaderName})` : ""}{" "}
            <span className="font-normal">{cell.users.length}명</span>
          </h2>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-border/30">
            {cell.users.map((user) => {
              const levelLabel = getLevelLabel(user.level);
              return (
                <div key={user.userId} className="flex items-center px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                      {user.level >= 2 && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            background: "hsl(var(--primary) / 0.1)",
                            color: "hsl(var(--primary))",
                          }}
                        >
                          {levelLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {getBirthDisplay(user.birth)} · {user.gisu}기
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit?.(user)}
                      type="button"
                      className="p-2 text-muted-foreground"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(user)}
                      type="button"
                      className="p-2 text-muted-foreground"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {cell.users.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                등록된 팀원이 없습니다.
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
});
