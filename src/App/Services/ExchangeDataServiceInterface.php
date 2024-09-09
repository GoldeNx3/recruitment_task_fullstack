<?php

declare(strict_types=1);

namespace App\Services;

interface ExchangeDataServiceInterface
{
    public function format(array $rates): array;
}