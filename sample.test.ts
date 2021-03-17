import { Client } from "pg";

let _pgClient: Client;

describe("test", () => {
	beforeEach(async () => {
		// test assumes you have postgres running locally on port 5432 (default), you have created a database called
		// "testing" and you set the password in the following variable
		const password = "<INSERT PASSWORD HERE>";
		_pgClient = new Client({
			connectionString: `postgresql://postgres:${password}@localhost:5432/testing`,
		});

		try {
			await _pgClient.connect();
		} catch (err) {
			console.error("Unable to connect to database:", err);
			throw err;
		}
	});
	afterEach(async () => {
		try {
			await _pgClient.end();
		} catch (err) {
			console.error("Unable to shutdown database:", err);
		}
	});

	it("is a slow test", async () => {
		// the pg resources (session handle) will be released if this test is allowed to complete, and afterEach runs
		// If it is interrupted, the session handle will not be released until Wallaby is restarted
		//
		// You can see this by looking at Postgres and viewing the active sessions and see they leak each time.
		//
		// I use the free dBeaver program (see https://dbeaver.io/) to monitor my postgres server connections
		// (right-click the database name, select Tools / Open Dashboard and look at the ServerSessions graphic), but you
		// can also look at the pg_catalog schema, in the pg_stat_activity view to see a list of all connections.

		await new Promise<void>((resolve) => setTimeout(resolve, 1000)); //ffdfffffffdsdfa
	});
});
