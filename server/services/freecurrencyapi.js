/**
 * Клас-клієнт для взаємодії з API сервісу freecurrencyapi.com
 * Надає зручний інтерфейс для отримання даних про валюти, актуальні та історичні курси
 */
class Freecurrencyapi {
    /**
     * Створює новий екземпляр клієнта API
     * @param {string} [apiKey=""] - API-ключ для авторизації запитів
     */
    constructor(apiKey = "") {
        // Базовий URL API (версія v1)
        this.baseUrl = "https://api.freecurrencyapi.com/v1/";

        // Заголовки, що додаються до кожного запиту
        this.headers = {
            apikey: apiKey,
        };
    }

    /**
     * Базовий метод для виконання HTTP-запитів до API
     * @param {string} endpoint - Кінцева точка API (status, currencies, latest, historical тощо)
     * @param {Object} [params={}] - Об'єкт з query-параметрами запиту
     * @returns {Promise<Object>} - Розпарсена JSON-відповідь від API
     */
    async call(endpoint, params = {}) {
        // Перетворюємо параметри в рядок query string
        // Усі значення приводимо до string, щоб уникнути проблем з типами
        const paramString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {})
        ).toString();

        // Виконуємо GET-запит
        const response = await fetch(
            `${this.baseUrl}${endpoint}?${paramString}`,
            {
                headers: this.headers,
            }
        );

        // Повертаємо розпарсений JSON (включаючи помилки API)
        return await response.json();
    }

    /**
     * Отримання статусу API-ключа (лімітів, використання тощо)
     * @returns {Promise<Object>} - Інформація про статус API
     */
    status() {
        return this.call("status");
    }

    /**
     * Отримання списку валют та їх метаданих
     * @param {Object} [params] - Фільтри: currencies, type тощо
     * @returns {Promise<Object>} - Дані про валюти
     */
    currencies(params) {
        return this.call("currencies", params);
    }

    /**
     * Отримання найсвіжіших (актуальних) курсів валют
     * @param {Object} [params] - base_currency, currencies тощо
     * @returns {Promise<Object>} - Об'єкт з актуальними курсами
     */
    latest(params) {
        return this.call("latest", params);
    }

    /**
     * Отримання історичних курсів на конкретну дату
     * @param {Object} [params] - date (обов'язково), base_currency, currencies тощо
     * @returns {Promise<Object>} - Курси на вказану дату
     */
    historical(params) {
        return this.call("historical", params);
    }
}

export default Freecurrencyapi;
