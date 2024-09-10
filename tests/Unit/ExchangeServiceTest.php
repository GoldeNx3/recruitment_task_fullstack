<?php

declare(strict_types=1);

namespace Unit;

use App\Services\ExchangeDataService;
use App\Services\NbpService;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ExchangeServiceTest extends TestCase
{
    private $client;
    private $dataService;
    private $nbpService;

    protected function setUp(): void
    {
        $this->client = $this->createMock(HttpClientInterface::class);
        $this->dataService = $this->createMock(ExchangeDataService::class);
        $this->nbpService = new NbpService($this->client);
        $this->nbpService->dataService = $this->dataService;
    }

    public function testGetCurrencyRatesWithoutDate(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->method('toArray')->willReturn([
            [
                'rates' => [
                    ['currency' => 'USD', 'code' => 'USD', 'mid' => 3.8],
                    ['currency' => 'EUR', 'code' => 'EUR', 'mid' => 4.5],
                ]
            ]
        ]);

        $this->client->method('request')->willReturn($response);
        $this->dataService->method('format')->willReturn([
            ['currency' => 'USD', 'code' => 'USD', 'mid' => 3.8],
            ['currency' => 'EUR', 'code' => 'EUR', 'mid' => 4.5],
        ]);

        $currencyRates = $this->nbpService->getCurrencyRates();

        $this->assertCount(2, $currencyRates);
        $this->assertEquals('USD', $currencyRates[0]['code']);
        $this->assertEquals(3.8, $currencyRates[0]['mid']);
        $this->assertEquals('EUR', $currencyRates[1]['code']);
        $this->assertEquals(4.5, $currencyRates[1]['mid']);
    }

    public function testGetCurrencyRatesWithDate(): void
    {
        $date = '2023-01-01';
        $response = $this->createMock(ResponseInterface::class);
        $response->method('toArray')->willReturn([
            [
                'rates' => [
                    ['currency' => 'USD', 'code' => 'USD', 'mid' => 3.8],
                    ['currency' => 'EUR', 'code' => 'EUR', 'mid' => 4.5],
                ]
            ]
        ]);

        $this->client->method('request')->with('GET', "https://api.nbp.pl/api/exchangerates/tables/A/{$date}")->willReturn($response);
        $this->dataService->method('format')->willReturn([
            ['currency' => 'USD', 'code' => 'USD', 'mid' => 3.8],
            ['currency' => 'EUR', 'code' => 'EUR', 'mid' => 4.5],
        ]);

        $currencyRates = $this->nbpService->getCurrencyRates($date);

        $this->assertCount(2, $currencyRates);
        $this->assertEquals('USD', $currencyRates[0]['code']);
        $this->assertEquals(3.8, $currencyRates[0]['mid']);
        $this->assertEquals('EUR', $currencyRates[1]['code']);
        $this->assertEquals(4.5, $currencyRates[1]['mid']);
    }
}
