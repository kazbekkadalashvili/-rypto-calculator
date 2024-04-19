<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redis;

class PriceController extends Controller
{
    public function index()
    {
        $crypto_list = explode(',', env('CRYPTO_PAIR_LIST'));
        $exchange = env('EXCHANGE');
        $cryptos = [];
        $fiats = [];

        foreach ($crypto_list as $pair) {
            $pairs = explode('/', $pair);
            $crypto = $pairs[0];
            $fiat = $pairs[1];
            if (!in_array($crypto, $cryptos)) {
                $cryptos[] = $crypto;
            }
            if (!in_array($fiat, $fiats)) {
                $fiats[] = $fiat;
            }
        }

        return Inertia::render('Welcome', [
            'cryptos' => $cryptos,
            'fiats' => $fiats,
            'exchange' => $exchange,
        ]);
    }

    public function getPrice(Request $request)
    {
        $request->validate([
            'crypto' => 'required|string',
            'fiat' => 'required|string' 
        ]);

        $crypto = $request->crypto;
        $fiat = $request->fiat;

        $pair = "{$crypto}:{$fiat}";

        $redis = Redis::connection();
        $price = $redis->get("price:{$pair}");

        if (!$price) {
            return response()->json([
                'error' => "Price for pair {$pair} not found."
            ], 404);
        }

        return response()->json(json_decode($price, true));
    }
}
