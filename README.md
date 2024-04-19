# Crypto Calculator 


## Installation
Clone the repository:
```sh
git clone https://github.com/kazbekkadalashvili/crypto-calculator.git
```

##### Install dependencies (Backend):
```sh
cd crypto-calculator
composer install 
```


##### Install dependencies (Frontend):
```sh
npm install 
# Or if you're using yarn:
yarn install
```

## Setup Environment:
##### Generate an application key: 
```sh
php artisan key:generate
```

## Configuration
##### Environment Variables:
EXCHANGE: Set this to the name of your cryptocurrency exchange (default is 'coinbase').
CRYPTO_PAIR_LIST: A comma-separated list of cryptocurrency pairs to track (e.g., 'BTC/USD,ETH/USD,...').
```sh
EXCHANGE='coinbase'
CRYPTO_PAIR_LIST='BTC/USD,ETH/USD,LTC/USD,SOL/USD,BTC/EUR,ETH/EUR,LTC/EUR,SOL/EUR,BTC/GBP,ETH/GBP,LTC/GBP,SOL/GBP,BTC/JPY,ETH/JPY,LTC/JPY,SOL/JPY'
```

## Development
##### Start the Laravel development server:
```sh
php artisan serve
```

##### Start the React development server:
```sh
npm run dev 
# Or if you're using yarn:
yarn dev
```

## Task Scheduling
##### Start the Scheduler:
```sh
php artisan schedule:work 
```

