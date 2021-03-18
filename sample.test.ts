import { Client } from "pg";

export class Resource {
	uniqueId: number = Math.round(Math.random() * 10000);
	pgClient: Client;

	async setup() {
		console.log(`sample.test.ts:Resource:setup: Setup started for ${this.uniqueId}`);
		const password = "<PASSWORD HERE>";

		try {
			console.log(`sample.test.ts:Resource:setup: Setup 1 ${this.uniqueId}`);
			this.pgClient = new Client({
				connectionString: `postgresql://postgres:${password}@localhost:5432/testing`,
			});
			console.log(`sample.test.ts:Resource:setup: Setup 2 ${this.uniqueId}`);
			await new Promise<void>((resolve) => setTimeout(resolve, 1000));
			console.log(`sample.test.ts:Resource:setup: Setup 3 ${this.uniqueId}`);
			await this.pgClient.connect();
			console.log(`sample.test.ts:Resource:setup: Setup 4 ${this.uniqueId}`);
		} catch (err) {
			console.error(
				`sample.test.ts:Resource:setup: Unable to connect to database for ${this.uniqueId}: ${err.toString()}`
			);
			throw err;
		}
		console.log(`sample.test.ts:Resource:setup: Setup complete for ${this.uniqueId}`);
	}

	async teardown(): Promise<void> {
		console.log(`sample.test.ts:Resource:teardown: Teardown started for ${this.uniqueId}`);
		try {
			await this.pgClient.query('select * from "test-1"."User"');
			console.log(`sample.test.ts:Resource:teardown: Teardown 5 for ${this.uniqueId}`);
			await this.pgClient.query('select * from "test-1"."Organization"');
			console.log(`sample.test.ts:Resource:teardown: Teardown 4 for ${this.uniqueId}`);
			await this.pgClient.query('select * from "test-1"."Team"');
			console.log(`sample.test.ts:Resource:teardown: Teardown 3 for ${this.uniqueId}`);
			await this.pgClient.query('select * from "test-1"."Device"');
			console.log(`sample.test.ts:Resource:teardown: Teardown 2 for ${this.uniqueId}`);
			await this.pgClient.query('select * from "test-1"."RateLimiter"');
			console.log(`sample.test.ts:Resource:teardown: Teardown 1 for ${this.uniqueId}`);
			// await new Promise<void>((resolve) => setTimeout(resolve, 500));
			if (this.pgClient) await this.pgClient.end();
		} catch (err) {
			console.error(
				`sample.test.ts:Resource:teardown: Error ending client for ${this.uniqueId}: ${err.toString()}`
			);
		}
		this.pgClient = undefined;
		console.log(`sample.test.ts:Resource:teardown: Teardown complete for ${this.uniqueId}`);
	}
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			nodeGlobal: { resources: Resource[] };
		}
	}
}

describe("test", () => {
	let resource: Resource;
	beforeEach(async () => {
		console.log("in BeforeEach, allocating resources");
		resource = new Resource();
		console.log(`sample.test.ts:beforeEach: Before started for ${resource.uniqueId}`);
		if (global.nodeGlobal) global.nodeGlobal.resources.push(resource);
		await resource.setup();
		console.log(`sample.test.ts:beforeEach: Before done for ${resource.uniqueId}`);
	});
	afterEach(async () => {
		console.log(`sample.test.ts:afterEach: After started for ${resource.uniqueId}`);
		await resource.teardown();

		if (global.nodeGlobal)
			global.nodeGlobal.resources = global.nodeGlobal.resources.filter(
				(teardownResource) => teardownResource !== resource
			);
		console.log(`sample.test.ts:afterEach: After complete for ${resource.uniqueId}`);
		resource = undefined;
	});

	it("is a slow test", async () => {
		await new Promise<void>((resolve) => setTimeout(resolve, 1000));
		expect(3).toBe(3);
	});
});
