module.exports = function (wallaby) {
	// return the Wallaby options used to define the test runner
	return {
		autoDetect: true,
		setup: function (wallaby) {
			global.resources = [];
			console.log("wallaby.js:setup: setup for test");
		},

		teardown: function (wallaby) {
			console.log(`wallaby.js:teardown: Tearing down ${global.resources.length} setups`);
			let setupNumber = 1;
			global.resources.forEach(async (resource) => {
				try {
					console.log(
						`wallaby.js:teardown: #${setupNumber}: Tearing down lost setup #${resource.uniqueId}...`
					);
					await resource.teardown();
					console.log(`wallaby.js:teardown: #${setupNumber}: #${resource.uniqueId} torn down`);
				} catch (err) {
					console.error(
						`wallaby.js:teardown: #${setupNumber}: Failed to tear down setup #${resource.uniqueId}: ${err}`
					);
					console.log(err.stack);
				}
			});
			console.log("wallaby.js:teardown: Teardown complete");
		},
	};
};
