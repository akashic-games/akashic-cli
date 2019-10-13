module.exports = {
	launch: {
		headless: true,
		executablePath: process.env.CHROME_BIN || null,
		args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
	}
};
