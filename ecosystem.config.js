'use strict';

require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'cabbie',
      script: './bin/server.js',
      instances: process.env.WEB_CONCURRENCY || 1,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
        DEV: 'cabbie:server',
      },
      env_production: {
        NODE_ENV: 'production',
        DEV: 'cabbie:server',
      },
    },
  ],
};
