<?php

namespace App\Services;

interface ExchangeRatesInterface
{
    public function getCurrencyRates(?string $date = null): array;
}