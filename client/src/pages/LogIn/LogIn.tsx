import styles from "./LogIn.module.scss";
import Input from "../../components/Input/Input";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";

interface LogInFormInputs {
    email: string;
    password: string;
}

/**
 * Компонент сторінки входу в систему
 * Використовує react-hook-form для валідації форми та локальний стан для обробки помилок/завантаження
 */
const LogIn: FC = () => {
    // Стан завантаження під час запиту до сервера
    const [isLoading, setIsLoading] = useState(false);

    // Помилка від сервера (якщо авторизація не пройшла або проблеми з мережею)
    const [serverError, setServerError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Ініціалізація react-hook-form з типізацією полів форми
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LogInFormInputs>({
        mode: "onChange", // валідація в реальному часі при зміні
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /**
     * Обробник відправки форми
     * Виконує POST-запит на авторизацію, зберігає токен та перенаправляє користувача
     */
    const onSubmit: SubmitHandler<LogInFormInputs> = async (data) => {
        try {
            setIsLoading(true);
            setServerError(null);

            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Помилка від сервера (401, 400 тощо)
                throw new Error(responseData.message || "Помилка авторизації");
            }

            // Успішний логін
            localStorage.setItem("token", responseData.token);

            // Перенаправлення на захищену сторінку
            navigate("/CurrencyList", { replace: true });

            // Очищення форми після успішного входу
            reset();
        } catch (error) {
            console.error("Помилка авторизації:", error);

            // Обробка мережевих помилок або таймаутів
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Неможливо підключитися до сервера"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className={styles.logIn}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            {/* Відображення помилок від сервера */}
            {serverError && (
                <div className={styles.error} role="alert">
                    {serverError}
                </div>
            )}

            {/* Поле для email */}
            <Input
                type="email"
                placeholder="Введіть ваш email"
                style={{ height: "17%" }}
                id="email"
                // Реєстрація поля з валідацією
                {...register("email", {
                    required: "Email обов'язковий",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Некоректний формат email",
                    },
                })}
                error={errors.email?.message}
                disabled={isLoading}
            />

            {/* Поле для пароля */}
            <Input
                type="password"
                placeholder="Введіть пароль"
                style={{ height: "17%" }}
                id="password"
                {...register("password", {
                    required: "Пароль обов'язковий",
                    // Можна додати: minLength: { value: 6, message: "Мінімум 6 символів" }
                })}
                error={errors.password?.message}
                disabled={isLoading}
            />

            {/* Контейнер кнопок */}
            <div className={styles.btnContainer}>
                {/* Кнопка "Увійти" */}
                <Button
                    descr={isLoading ? "Завантаження..." : "Увійти"}
                    disabled={isLoading}
                />

                {/* Кнопка переходу на реєстрацію */}
                <Link to="/SignUp">
                    <Button descr="Зареєструватися" />
                </Link>
            </div>
        </form>
    );
};

export default LogIn;
