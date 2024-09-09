<?php

declare(strict_types=1);

namespace App\Controller;

use App\Services\NbpService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExchangeRatesController extends AbstractController
{
    private $client;

    /**
     * Konstruktor klasy
     */
    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    /**
     * Zwraca kursy walut z NBP
     */
    public function currencies(string $date = null): Response
    {
        // Tutaj jeszcze przydałaby się walidacja tego co przychodzi w $date
        
        $nbpService = new NbpService($this->client);
        $data = $nbpService->getCurrencyRates($date);

        return new Response(
            json_encode(['data' => $data]),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }
}
