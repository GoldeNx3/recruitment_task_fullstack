import * as API from "./API";

/**
 * Pobiera dane z API
 */
export const getExchangeRates = async (date = null) => {
    if (!date) {
        date = "";
    }
    const response = await API.apiClient.get(`/api/exchange-rates/${date}`);
    return response.data.data;
}
