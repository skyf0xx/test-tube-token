import { createDataItemSigner, dryrun, result } from '@permaweb/aoconnect';
import { sendMessage } from './messages';
import { adjustDecimalString, withRetry } from './utils';
import {
    CACHE_EXPIRY,
    generateCacheKey,
    getFromCache,
    setCache,
} from './cache';

export const TEST_TOKEN = 'U09Pg31Wlasc8ox5uTDm9sjFQT8XKcCR2Ru5lmFMe2A';

interface StakedBalance {
    address: never;
    name: string;
    amount: string;
    weight?: string;
}

// Constants

// Types
export interface JWK {
    kty: string;
    n?: string;
    e?: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
}

export interface TotalSupplyResponse {
    Action: string;
    Data: string;
    Ticker: string;
}

export type StakedBalances = StakedBalance[];

export interface MessageResult {
    Messages: Array<{
        Data?: string;
        Tags: Array<{
            name: string;
            value: string;
        }>;
    }>;
}

export async function getTokens(quantity: string): Promise<string> {
    try {
        const tags = [
            { name: 'Action', value: 'Faucet' },
            { name: 'Quantity', value: quantity },
        ];

        // Add quantity tag if provided

        const signer = createDataItemSigner(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalThis as any).arweaveWallet
        );

        // Use withRetry for more reliable transaction sending
        await withRetry(async () => {
            // Send the message and get the result
            const response = await sendAndGetResult(
                TEST_TOKEN,
                tags,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                signer as any,
                false
            );

            const errorTag = response.Messages[0]?.Tags.find(
                (tag) => tag.name === 'Error'
            );
            if (errorTag) {
                throw new Error(`Faucet error: ${errorTag.value}`);
            }
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const address = await window.arweaveWallet?.getActiveAddress();
        if (!address) return '0';
        const balanceResult = await getBalance(address, TEST_TOKEN);

        return balanceResult?.balance || '0';
    } catch (error) {
        console.error('Error dispensing tokens:', error);
        throw new Error(
            error instanceof Error ? error.message : 'Failed to dispense tokens'
        );
    }
}

export async function sendAndGetResult(
    target: string,
    tags: { name: string; value: string }[],
    signer = false,
    cacheExpiry: number | false,
    userKey = ''
): Promise<MessageResult> {
    let response;
    let cached;
    let cacheKey = '';

    // Generate a consistent key for caching
    const throttleKey = `throttle_${generateCacheKey(target, tags)}${
        userKey ? '-' + userKey : ''
    }`;

    // Check localStorage for recent identical calls
    const throttleData = localStorage.getItem(throttleKey);
    if (throttleData) {
        try {
            const parsed = JSON.parse(throttleData);
            // If less than 10 seconds old, return stored result
            if (Date.now() - parsed.timestamp < 10000 && parsed.response) {
                console.log('Throttled request - using recent result');
                return parsed.response;
            }
        } catch (e) {
            // Invalid data, continue with request
            console.warn('Invalid throttle data:', e);
        }
    }

    // Continue with normal caching mechanism
    if (cacheExpiry) {
        cacheKey =
            generateCacheKey(target, tags) + (userKey ? '-' + userKey : '');
        cached = await getFromCache(cacheKey);
    }

    if (cached) {
        // Store in throttle cache too
        localStorage.setItem(
            throttleKey,
            JSON.stringify({
                timestamp: Date.now(),
                response: cached,
            })
        );
        return cached;
    }

    if (signer === false) {
        response = await dryrun({
            process: target,
            tags,
        });
    } else {
        const messageId = await sendMessage(target, tags, signer);
        if (!messageId) {
            throw new Error('Failed to send message');
        }

        response = await result({
            message: messageId,
            process: target,
        });
    }

    if (cacheExpiry) {
        setCache(cacheKey, response, cacheExpiry);
    }

    // Store result with timestamp in localStorage for throttling
    localStorage.setItem(
        throttleKey,
        JSON.stringify({
            timestamp: Date.now(),
            response: response,
        })
    );

    return response;
}

// Helper Functions
function findTagValue(
    result: MessageResult,
    tagName: string
): string | undefined {
    return result.Messages[0].Tags.find((tag) => tag.name === tagName)?.value;
}

function handleError<T>(error: unknown, context: string, defaultValue?: T): T {
    console.error(`Error ${context}:`, error);
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw error;
}

// Balance response interface
export interface TokenBalance {
    balance: string;
    ticker?: string;
    account?: string;
}

// Create a dedicated object for tracking in-flight requests
const inFlightRequests = new Map<string, boolean>();

export async function getBalance(
    address: string,
    token: string,
    tokenDenomination: number | false = false
): Promise<TokenBalance | null> {
    // Create a cache key for the balance result
    const balanceCacheKey = `balance_${address}_${token}`;
    const inFlightKey = `in_flight_${balanceCacheKey}`;

    // Try to get from localStorage cache first
    const cachedBalance = localStorage.getItem(balanceCacheKey);
    if (cachedBalance) {
        try {
            const parsedCache = JSON.parse(cachedBalance);
            // Check if cache is less than 10 seconds old
            if (Date.now() - parsedCache.timestamp < 10000) {
                console.log('Using cached balance data');
                return parsedCache.data;
            }
        } catch (e) {
            // Invalid cache data, proceed with fresh request
            console.warn('Invalid cache data:', e);
        }
    }

    // Track in-flight requests to prevent duplicates
    if (inFlightRequests.get(inFlightKey)) {
        console.log('Balance request already in flight, waiting...');

        // Wait for the in-flight request to complete
        try {
            await new Promise((resolve) => {
                const checkCache = () => {
                    if (!inFlightRequests.get(inFlightKey)) {
                        resolve(true);
                        return;
                    }
                    setTimeout(checkCache, 100);
                };
                checkCache();
            });

            // Try reading from cache again after waiting
            const refreshedCache = localStorage.getItem(balanceCacheKey);
            if (refreshedCache) {
                try {
                    const parsedCache = JSON.parse(refreshedCache);
                    return parsedCache.data;
                } catch (e) {
                    console.warn('Invalid cache data after waiting:', e);
                }
            }
        } catch (err) {
            console.error('Error waiting for in-flight request:', err);
        }
    }

    // Mark this request as in-flight
    inFlightRequests.set(inFlightKey, true);

    const tags = [
        { name: 'Action', value: 'Balance' },
        { name: 'Target', value: address },
    ];

    try {
        const result = await sendAndGetResult(token, tags, false, false);
        // Get values from tags
        const balance = findTagValue(result, 'Balance');
        const ticker = findTagValue(result, 'Ticker');
        const account = address;

        if (!balance || !ticker || !account) {
            console.error('Missing required balance information in response');
            return null;
        }

        const denomination =
            tokenDenomination || (await getTokenDenomination(token));
        const adjustedBalance = adjustDecimalString(balance, denomination);

        const balanceResult = {
            balance: adjustedBalance,
            ticker: ticker,
            account: account,
        };

        // Cache the result with timestamp
        localStorage.setItem(
            balanceCacheKey,
            JSON.stringify({
                timestamp: Date.now(),
                data: balanceResult,
            })
        );

        return balanceResult;
    } catch (error) {
        return handleError(error, 'getting token balance', null);
    } finally {
        // Mark request as completed
        inFlightRequests.delete(inFlightKey);
    }
}

export async function getTokenDenomination(token: string): Promise<number> {
    const tags = [{ name: 'Action', value: 'Info' }];

    try {
        return await withRetry(async () => {
            const result = await sendAndGetResult(
                token,
                tags,
                false,
                CACHE_EXPIRY.MONTH
            );
            const denominationTag = result.Messages[0]?.Tags.find(
                (tag) => tag.name === 'Denomination'
            );

            if (!denominationTag) {
                throw new Error('Denomination tag not found in response');
            }

            const denomination = Number(denominationTag.value);
            return isNaN(denomination) ? 8 : denomination;
        });
    } catch (error) {
        return handleError(error, 'getting token denomination', 8);
    }
}
