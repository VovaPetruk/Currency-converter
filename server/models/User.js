import mongoose from "mongoose";

/**
 * Схема моделі користувача для MongoDB
 */
const userSchema = new mongoose.Schema(
    {
        // Email користувача — використовується як унікальний ідентифікатор для авторизації
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        // Захешований пароль користувача
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Автоматично додає поля createdAt та updatedAt
    }
);

/**
 * Модель User для роботи з колекцією користувачів у базі даних
 */
const User = mongoose.model("User", userSchema);

export default User;
