import request from 'supertest';
import app, { listener } from '../../index';
import { JOE_TOKEN } from '../../constants';

const numberOfRequests = 100; // Number of requests to send for load testing
const api_url = `/v1/prices/0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7/0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e`; // USDT/USDC pair to make sure there is enough liquidity

describe("Performance Load Testing", () => {
    test("Total Response Time & Resquest per second - v1", async () => {
        // Send multiple requests and measure the response time
        const promises = Array.from({ length: numberOfRequests }, () => {
            return request(app).get(api_url);
        });

        const startTimestamp = Date.now();

        await Promise.all(promises);

        const endTimestamp = Date.now();
        const totalResponseTime = endTimestamp - startTimestamp;
        const requestsPerSecond = numberOfRequests / (totalResponseTime / 1000);

        listener.close();

        console.log(`Total response time: ${totalResponseTime}ms`);
        console.log(`Requests per second: ${requestsPerSecond}`);
        expect(totalResponseTime).toBeGreaterThan(0);
        expect(requestsPerSecond).toBeGreaterThan(0);
    }, 30000);    

    test('P99 Response Time - v1', async () => {
        let responseTimes = [];
        for(let i = 0; i < numberOfRequests; i++ ) {
            const startTimestamp = Date.now();

            await request(app).get(api_url);

            const endTimestamp = Date.now();
            const totalResponseTime = endTimestamp - startTimestamp;
            responseTimes.push(totalResponseTime);
        }
        responseTimes.sort((a, b) => b - a); // Sort in descending order
        const p99Index = Math.ceil((1 / 100) * responseTimes.length);
        const p99ResponseTime = responseTimes[p99Index - 1];

        listener.close();

        console.log(`P99 response time: ${p99ResponseTime}ms`);
        expect(p99ResponseTime).toBeGreaterThan(0);
    }, 30000);
});