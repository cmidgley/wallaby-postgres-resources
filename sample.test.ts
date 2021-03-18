import { Client } from "pg";

export class Resource {
	uniqueId: number = Math.round(Math.random() * 10000);
	pgClient: Client;

	async setup() {
		console.log(`sample.test.ts:Resource:setup: Setup started for ${this.uniqueId}`);
		const password = "11341134";

		try {
			this.pgClient = new Client({
				connectionString: `postgresql://postgres:${password}@localhost:5432/testing`,
			});
			await this.pgClient.connect();
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
			await new Promise<void>((resolve) => setTimeout(resolve, 500));
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
