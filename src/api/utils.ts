type Currency = 'AED' | 'USDT' | 'INR' | 'USD';

let cachedRates: Record<Currency, number> | null = null;


export async function fetchExchangeRates(): Promise<Record<Currency, number>> {
    if (cachedRates) return cachedRates;


    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const time = new Date().getTime();
    cachedRates = {
        USD: 1,
        AED: data.rates.AED,
        INR: data.rates.INR,
        USDT: 1, // Stablecoin
    };

    return cachedRates;
}



