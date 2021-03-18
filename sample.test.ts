export class Resource {
	uniqueId: number = Math.round(Math.random() * 10000);

	async setup() {
		console.log(`sample.test.ts:Resource:setup: Setup started for ${this.uniqueId}`);

		try {
			await new Promise<void>((resolve) => setTimeout(resolve, 1000));
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
			await new Promise<void>((resolve) => setTimeout(resolve, 250));
			console.log(`sample.test.ts:Resource:teardown: Teardown 5 for ${this.uniqueId}`);
			await new Promise<void>((resolve) => setTimeout(resolve, 250));
			console.log(`sample.test.ts:Resource:teardown: Teardown 4 for ${this.uniqueId}`);
			await new Promise<void>((resolve) => setTimeout(resolve, 250));
			console.log(`sample.test.ts:Resource:teardown: Teardown 3 for ${this.uniqueId}`);
			await new Promise<void>((resolve) => setTimeout(resolve, 250));
			console.log(`sample.test.ts:Resource:teardown: Teardown 2 for ${this.uniqueId}`);
			await new Promise<void>((resolve) => setTimeout(resolve, 250));
			console.log(`sample.test.ts:Resource:teardown: Teardown 1 for ${this.uniqueId}`);
		} catch (err) {
			console.error(
				`sample.test.ts:Resource:teardown: Error ending client for ${this.uniqueId}: ${err.toString()}`
			);
		}
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
