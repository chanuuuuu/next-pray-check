import LoginClient from "../component/Login/LoginClient";
import styles from "./page.module.css";

export default async function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <main className={styles.loginMain}>
        <LoginClient />
      </main>
    </div>
  );
}
