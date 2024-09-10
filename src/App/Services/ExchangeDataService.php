<?php

declare(strict_types=1);

namespace App\Services;

use App\Currency;

class ExchangeDataService implements ExchangeDataServiceInterface
{
    private $currency;

    /**
     * Konsruktor klasy
     */
    public function __construct()
    {
        $this->currency = new Currency();
    }

    /**
     * Formatuje dane z kursami walut
     */
    public function format(array $rates): array
    {
        $currencyRates = [];
        foreach ($rates as $rate) {
            if (!in_array($rate['code'], $this->currency->getSupportedCurrencies())) {
                continue;
            }

            $currency = $this->currency->getCurrency($rate['code']);
            $currency['code'] = $rate['code'];

            $buy = $currency['rates']['buy'] ?? 0;
            $sell = $currency['rates']['sell'] ?? 0;

            $currency['rates']['buy'] = $buy ? $this->roundValue($rate['mid'] - $buy) : null;
            $currency['rates']['sell'] = $sell ? $this->roundValue($rate['mid'] + $sell) : null;

            $currencyRates[] = $currency;
        }

        return $currencyRates;
    }

    /**
     * Zaokrągla wartość do dwóch miejsc po przecinku
     */
    private function roundValue(float $value): float
    {
        return round($value, 2);
    }
}
