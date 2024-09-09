<?php

declare(strict_types=1);

namespace App\Services;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class NbpService implements ExchangeRatesInterface
{
    public $client;
    public $dataService;

    const API_URL = "https://api.nbp.pl/api/exchangerates/tables/A/";

    /**
     * Konsruktor klasy
     */
    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        $this->dataService = new ExchangeDataService();
    }

    /**
     * Pobiera kursy walut z serwisu
     */
    public function getCurrencyRates(?string $date = null): array
    {
        $url = self::API_URL . $date;

        $currencyRates = [];
        try {
            $response = $this->client->request('GET', $url);
            $data = $response->toArray();
            $rates = reset($data);
            $currencyRates = $this->dataService->format($rates['rates']);
        } catch (\Exception $e) {
            // Tutaj lepsza byłaby implementacja loggera
            error_log('Error while fetching data: ' . $e->getMessage());
        }

        return $currencyRates;
    }
}
