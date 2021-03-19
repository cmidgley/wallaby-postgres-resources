module.exports = function (wallaby) {
	// return the Wallaby options used to define the test runner
	return {
		autoDetect: true,
		setup: function (wallaby) {
			if (global.resources) {
				wallaby.delayStart();
				let setupNumber = 1;
				Promise.all(
					global.resources.map((r) => {
						console.log(`wallaby.js:teardown: #${setupNumber}: Tearing down lost setup #${r.uniqueId}...`);
						r.teardown();
					})
				).then(() => {
					global.resources = [];
					console.log("wallaby.js:setup: teardown done; setup for test");
					wallaby.start();
				});
			} else {
				console.log("wallaby.js:setup: no prior teardown; setup for test");
				global.resources = [];
			}
		},

		teardown: function (wallaby) {},
	};
};
