import styles from "./SignUp.module.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface SignUpFormInputs {
    email: string;
    password: string;
    repeatPassword: string;
}

/**
 * Компонент сторінки реєстрації користувача
 * Використовує react-hook-form для валідації форми, локальний стан для обробки завантаження та повідомлень
 */
const SignUp: FC = () => {
    // Стан завантаження під час запиту до сервера
    const [isLoading, setIsLoading] = useState(false);

    // Помилка від сервера або клієнтська валідація (наприклад, паролі не співпадають)
    const [serverError, setServerError] = useState<string | null>(null);

    // Повідомлення про успішну реєстрацію
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const navigate = useNavigate();

    // Ініціалізація react-hook-form з типізацією полів
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignUpFormInputs>({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            repeatPassword: "",
        },
    });

    /**
     * Обробник відправки форми
     * Перевіряє співпадіння паролів, виконує POST-запит на реєстрацію,
     * зберігає токен та перенаправляє користувача у разі успіху
     */
    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        // Клієнтська перевірка співпадіння паролів
        if (data.password !== data.repeatPassword) {
            setServerError("Паролі не співпадають");
            return;
        }

        try {
            setIsLoading(true);
            setServerError(null);
            setServerSuccess(null);

            const response = await fetch("http://localhost:5000/signUp", {
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
                // Помилка від сервера (наприклад, email вже існує)
                throw new Error(responseData.message || "Помилка реєстрації");
            }

            // Успішна реєстрація
            setServerSuccess(responseData.message || "Реєстрація успішна");

            // Зберігаємо токен та автоматично авторизуємо користувача
            localStorage.setItem("token", responseData.token);

            // Очищення форми
            reset();

            // Перенаправлення на захищену сторінку
            navigate("/CurrencyList", { replace: true });
        } catch (error) {
            console.error("Помилка реєстрації:", error);

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
            className={styles.signUp}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            {/* Відображення помилок */}
            {serverError && (
                <div className={styles.error} role="alert">
                    {serverError}
                </div>
            )}

            {/* Відображення повідомлення про успіх */}
            {serverSuccess && (
                <div className={styles.success} role="status">
                    {serverSuccess}
                </div>
            )}

            {/* Поле для email */}
            <Input
                type="email"
                placeholder="Введіть ваш email"
                style={{ height: "12%" }}
                id="email"
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
                style={{ height: "12%" }}
                id="password"
                {...register("password", {
                    required: "Пароль обов'язковий",
                    // Рекомендація: додати minLength: { value: 6, message: "Мінімум 6 символів" }
                })}
                error={errors.password?.message}
                disabled={isLoading}
            />

            {/* Поле для повторення пароля */}
            <Input
                type="password"
                placeholder="Повторіть пароль"
                style={{ height: "12%" }}
                id="repeatPassword"
                {...register("repeatPassword", {
                    required: "Повторіть пароль",
                    // Клієнтська перевірка співпадіння (додатково до onSubmit)
                    validate: (value, formValues) =>
                        value === formValues.password ||
                        "Паролі не співпадають",
                })}
                error={errors.repeatPassword?.message}
                disabled={isLoading}
            />

            {/* Контейнер кнопок */}
            <div className={styles.btnContainer}>
                {/* Кнопка переходу на сторінку входу */}
                <Link to="/LogIn">
                    <Button
                        descr={isLoading ? "Завантаження..." : "Увійти"}
                        disabled={isLoading}
                    />
                </Link>

                {/* Кнопка відправки форми реєстрації */}
                <Button
                    descr={isLoading ? "Завантаження..." : "Зареєструватися"}
                    disabled={isLoading}
                />
            </div>
        </form>
    );
};

export default SignUp;
