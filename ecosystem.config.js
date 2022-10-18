module.exports = {
	apps: [
      {
        name: 'LCMSBack',
        script: 'npm',
        args: 'run develop',
        env: {
          NODE_ENV: 'production',
        },
        exp_backoff_restart_delay: 100,
      },
    ],
  };
