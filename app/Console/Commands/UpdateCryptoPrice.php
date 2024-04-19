<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use ccxt\ccxt;
use Illuminate\Support\Facades\Redis;

class UpdateCryptoPrice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-crypto-price';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $exchange = env('EXCHANGE');
        $crypto_list = explode(',', env('CRYPTO_PAIR_LIST'));

        $exchangeClass = "\\ccxt\\$exchange";
        if (!class_exists($exchangeClass)) {
            $this->error("Exchange class $exchangeClass not found.");
            return;
        }

        $exchangeC = new $exchangeClass();

        if (!$exchangeC->has['fetchTicker']) {
            $this->error("The $exchangeId exchange does not support fetching tickers.");
            return;
        }

        foreach ($crypto_list as $pair) {
            $ticker = $exchangeC->fetchTicker($pair);

            $newPrice = $ticker['last'];

            $pairs = explode('/', $pair);
            $crypto = $pairs[0];
            $fiat = $pairs[1];

            Redis::set("price:{$crypto}:{$fiat}", json_encode(["price" => $newPrice, "timestamp" => now()]));
            $this->info("Price for {$pair} on {$exchange} has updated: {$newPrice}");
        }
    }
}
