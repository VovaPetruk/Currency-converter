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

const SignUp: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignUpFormInputs>();

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        if (data.password !== data.repeatPassword) {
            setServerError("Passwords do not match");
            return;
        }
        try {
            setIsLoading(true);
            setServerError(null);
            setServerSuccess(null);

            const response = await fetch("http://localhost:5000/signUp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setServerError(responseData.message || "Registration error");
            } else {
                setServerSuccess(
                    responseData.message || "Registration is successful"
                );
                localStorage.setItem("token", responseData.token);
                reset();
                navigate("/CurrencyList");
            }
        } catch (error) {
            console.error("Server connection error:", error);
            setServerError("Unable to connect to the server");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form className={styles.signUp} onSubmit={handleSubmit(onSubmit)}>
            {serverError && <div className={styles.error}>{serverError}</div>}
            {serverSuccess && (
                <div className={styles.success}>{serverSuccess}</div>
            )}

            <Input
                type="email"
                placeholder="Enter your e-mail"
                style={{ height: "12%" }}
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
                style={{ height: "12%" }}
                id={"password"}
                {...register("password", {
                    required: "Password is required",
                })}
                error={errors.password?.message}
            />
            <Input
                type="password"
                placeholder="Repeat your password"
                style={{ height: "12%" }}
                id={"repeatPassword"}
                {...register("repeatPassword", {
                    required: "Your passwords don't match",
                })}
                error={errors.repeatPassword?.message}
            />
            <div className={styles.btnContainer}>
                <Link to="/LogIn">
                    <Button
                        descr={isLoading ? "Loading..." : "Log In"}
                        disabled={isLoading}
                    />
                </Link>
                <Button
                    descr={isLoading ? "Loading..." : "Sign Up"}
                    disabled={isLoading}
                />
            </div>
        </form>
    );
};

export default SignUp;
