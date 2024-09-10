<?php

namespace App;

class Currency
{
    const DEFAULT_RATE = 0.15;

    public $currencies = [
        'EUR' => [
            'symbol' => '€',
            'name' => 'Euro',
            'rates' => [
                'buy' => 0.05,
                'sell' => 0.07
            ]
        ],
        'USD' => [
            'symbol' => '$',
            'name' => 'US Dollar',
            'rates' => [
                'buy' => 0.05,
                'sell' => 0.07
            ]
        ],
        'CZK' => [
            'symbol' => 'Kč',
            'name' => 'Czech Koruna',
            'rates' => [
                'buy' => null,
                'sell' => self::DEFAULT_RATE
            ]
        ],
        'IDR' => [
            'symbol' => 'Rp',
            'name' => 'Indonesian Rupiah',
            'rates' => [
                'buy' => null,
                'sell' => self::DEFAULT_RATE
            ]
        ],
        'BRL' => [
            'symbol' => 'R$',
            'name' => 'Brazilian Real',
            'rates' => [
                'buy' => null,
                'sell' => self::DEFAULT_RATE
            ]
        ]
    ];

    /**
     * Zwraca wartości dla wybranej waluty
     */
    public function getCurrency(string $currency): array
    {
        return $this->currencies[$currency] ?? [];
    }

    /**
     * Zwraca listę dostępnych walut
     */
    public function getSupportedCurrencies(): array
    {
        return array_keys($this->currencies);
    }
}
