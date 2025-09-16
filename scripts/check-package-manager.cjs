const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.includes('pnpm')) {
  console.error(
    '\x1b[31mThis project uses pnpm. Please use `pnpm install` instead.\x1b[0m',
  );
  process.exit(1);
}
