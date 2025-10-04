import styles from "./ManageLoading.module.css";
import gridStyles from "./UserGrid.module.css";

export function ManageLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.teamInfo}>현재 총 팀원 :</p>
        <button className={styles.registerBtn} disabled>
          등록
        </button>
      </div>

      {/* 첫 번째 셀 섹션 */}
      <div className={styles.skeletonSection}>
        <div className={gridStyles.cellHeader}>
          <h3 className={gridStyles.cellTitle}>1조</h3>
        </div>
        <div className={styles.skeletonUserGrid}>
          <div className={styles.skeletonGridHeader}>
            <div className={styles.skeletonHeaderCell}></div>
            <div className={styles.skeletonHeaderCell}></div>
            <div className={styles.skeletonHeaderCell}></div>
            <div className={styles.skeletonHeaderCell}></div>
          </div>
          <div className={styles.skeletonGridBody}>
            <div className={styles.skeletonGridRow}>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
            </div>
            <div className={styles.skeletonGridRow}>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
            </div>
            <div className={styles.skeletonGridRow}>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 두 번째 셀 섹션 */}
      <div className={styles.skeletonSection}>
        <div className={gridStyles.cellHeader}>
          <h3 className={gridStyles.cellTitle}>2조</h3>
        </div>
        <div className={styles.skeletonUserGrid}>
          <div className={styles.skeletonGridHeader}>
            <div className={styles.skeletonHeaderCell}></div>
            <div className={styles.skeletonHeaderCell}></div>
            <div className={styles.skeletonHeaderCell}></div>
            <div className={styles.skeletonHeaderCell}></div>
          </div>
          <div className={styles.skeletonGridBody}>
            <div className={styles.skeletonGridRow}>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
            </div>
            <div className={styles.skeletonGridRow}>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
            </div>
            <div className={styles.skeletonGridRow}>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
              <div className={styles.skeletonCell}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
