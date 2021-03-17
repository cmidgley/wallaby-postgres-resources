let processVar = 0;
let processSig = Math.round(Math.random() * 100);

describe("test", () => {
	beforeAll(async () => {
		++processVar;
		console.log(`beforeAll starting pid=${process.pid} processVar=${processVar} processSig=${processSig}`);
		await new Promise((resolve) => {
			setTimeout(() => resolve(), 1000);
		});
		console.log(`beforeAll ending pid=${process.pid} processVar=${processVar} processSig=${processSig}`);
	});
	afterAll(async () => {
		console.log(`afterAll starting pid=${process.pid} processVar=${processVar} processSig=${processSig}`);
		// await new Promise((resolve) => {
		// 	setTimeout(() => resolve(), 1000);
		// });
		console.log(`afterAll ending pid=${process.pid} processVar=${processVar} processSig=${processSig}`);
	});
	it("should be ok", () => {
		expect(3).toBe(3);
	});
});
