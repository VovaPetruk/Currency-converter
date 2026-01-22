import jwt from "jsonwebtoken";

/**
 * Middleware для перевірки та валідації JWT-токена авторизації
 *
 * @param {Object} req - Об'єкт запиту Express
 * @param {Object} res - Об'єкт відповіді Express
 * @param {Function} next - Функція, що передає управління наступному middleware або обробнику маршруту
 */
const authMiddleware = (req, res, next) => {
    // Отримуємо токен з заголовка Authorization, прибираючи префікс "Bearer "
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Якщо токен відсутній — повертаємо 401 Unauthorized
    if (!token) {
        return res.status(401).json({
            message: "No token, access denied",
        });
    }

    try {
        // Перевіряємо та розшифровуємо токен за допомогою секретного ключа
        // Успішна верифікація повертає payload токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Додаємо розшифровані дані користувача до об'єкта запиту
        // Зазвичай містить userId, role, email тощо — залежно від того, що було в payload при створенні токена
        req.user = decoded;

        // Успішна авторизація — передаємо управління далі
        next();
    } catch (error) {
        // Помилка верифікації може бути:
        // - invalid token (неправильний формат або підроблений)
        // - expired token (закінчився термін дії)
        // - jwt not active (після notBefore)
        return res.status(400).json({
            message: "Invalid or expired token",
        });
    }
};

export default authMiddleware;
