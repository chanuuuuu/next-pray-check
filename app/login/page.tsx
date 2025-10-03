import LoginForm from "../component/Login/LoginForm";
import styles from "./page.module.css";

export default async function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <main className={styles.loginMain}>
        <LoginForm />
      </main>
    </div>
  );
}
