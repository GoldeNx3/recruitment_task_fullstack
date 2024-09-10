import axios from "axios";

/**
 * Klasa pomocnicza do połączeń z API
 * Dzięki niej jesteśmy w stanie bardziej elastycznie zarządzać połączeniami z API
 * Np. możliwość wyświetlenia komunikatu o błędzie w przypadku błędu połączenia
 */

// To chyba lepiej byłoby wyrzucić do jakiegoś configa
const baseUrl = 'http://telemedi-zadanie.localhost';

// Stworzenie instancji axiosa z ustawionym base urlem
export const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// Przechwycenie odpowiedzi z API
// Zamiast console log powinien być jakiś alert, który wyświetli informacje, zostawawiam tak jako dodatek do zadania
apiClient.interceptors.response.use(
    (response) => {
        if (response.data.message) {
            if (!response.data.success) {
                console.log(response.data.message);
            } else {
                console.log(response.data.message);
            }
        }

        return response;
    },
    function (error) {
        if (error.response) {
            if (error.response.status === 422) {
                console.log('Form contains validation errors');
            } else {
                if (error.response.data.message) {
                    console.log(error.response.data.message);
                }
            }
        }

        return Promise.reject(error);
    }
);

