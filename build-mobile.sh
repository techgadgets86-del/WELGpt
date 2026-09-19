#!/bin/bash
echo "🚀 Building WELGPT for iOS via Capacitor..."

# 1. Temporarily move API routes out of the Next.js app directory
# This allows Next.js to successfully export a purely static HTML bundle for iOS
if [ -d "app/api" ]; then
    echo "📦 Decoupling API routes..."
    mv app/api app-api-backup
fi

# 2. Enable Static Export
echo "⚙️ Configuring static export..."
cat << 'CONFIG' > next.config.mobile.ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }
};
export default nextConfig;
CONFIG
mv next.config.ts next.config.backup.ts
mv next.config.mobile.ts next.config.ts

# 3. Build the frontend
echo "🔨 Compiling static bundle..."
npm run build

# 4. Restore API routes and original config
echo "🧹 Restoring original Next.js architecture..."
mv next.config.backup.ts next.config.ts
if [ -d "app-api-backup" ]; then
    mv app-api-backup app/api
fi

echo "✅ iOS Build generated in /out directory."
echo "Next step: Run 'npx cap sync ios android' to update Xcode project."

# 5. Sync Capacitor
echo "🔄 Syncing Capacitor projects..."
npx cap sync ios
npx cap sync android
echo "🎉 Mobile projects are completely ready."
