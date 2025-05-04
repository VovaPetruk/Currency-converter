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

const LogIn: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LogInFormInputs>();

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
                setServerError(responseData.message || "Login error");
            } else {
                localStorage.setItem("token", responseData.token);

                navigate("/CurrencyList");

                reset();
            }
        } catch (error) {
            console.error("Server connection error:", error);
            setServerError("Unable to connect to the server");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form className={styles.logIn} onSubmit={handleSubmit(onSubmit)}>
            {serverError && <div className={styles.error}>{serverError}</div>}

            <Input
                type="email"
                placeholder="Enter your e-mail"
                style={{ height: "17%" }}
                id={"email"}
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                    },
                })}
                error={errors.email?.message}
            />
            <Input
                type="password"
                placeholder="Enter your password"
                style={{ height: "17%" }}
                id={"password"}
                {...register("password", {
                    required: "Password is required",
                })}
                error={errors.password?.message}
            />
            <div className={styles.btnContainer}>
                <Button
                    descr={isLoading ? "Loading..." : "Log In"}
                    disabled={isLoading}
                />
                <Link to="/SignUp">
                    <Button descr="Sign Up" />
                </Link>
            </div>
        </form>
    );
};

export default LogIn;
