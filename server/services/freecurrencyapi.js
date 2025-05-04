class Freecurrencyapi {
    constructor(apiKey = "") {
        this.baseUrl = "https://api.freecurrencyapi.com/v1/";
        this.headers = {
            apikey: apiKey,
        };
    }

    async call(endpoint, params = {}) {
        const paramString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {})
        ).toString();

        const response = await fetch(
            `${this.baseUrl}${endpoint}?${paramString}`,
            {
                headers: this.headers,
            }
        );

        return await response.json();
    }

    status() {
        return this.call("status");
    }

    currencies(params) {
        return this.call("currencies", params);
    }

    latest(params) {
        return this.call("latest", params);
    }

    historical(params) {
        return this.call("historical", params);
    }
}

export default Freecurrencyapi;
