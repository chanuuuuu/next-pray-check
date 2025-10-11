import styles from "./CollapseButton.module.css";

interface CollapseButtonProps {
  isCollapsed: boolean;
  handleCollapse: () => void;
}

export function CollapseButton({
  isCollapsed,
  handleCollapse,
}: CollapseButtonProps) {
  return (
    <button
      className={styles.toggleBtn}
      onClick={handleCollapse}
      title={isCollapsed ? "펼치기" : "접기"}
    >
      <svg
        className={`${styles.toggleIcon} ${
          isCollapsed ? styles.collapsed : ""
        }`}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
  );
}
