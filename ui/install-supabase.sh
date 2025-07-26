#!/bin/bash

echo "Installing @supabase/supabase-js..."

# Try different package managers
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm add @supabase/supabase-js
elif command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn add @supabase/supabase-js
else
    echo "Using npm..."
    npm install @supabase/supabase-js
fi

echo "Installation complete!"
echo ""
echo "Next steps:"
echo "1. Create a .env file in the ui folder with:"
echo "   VITE_SUPABASE_URL=your_supabase_url"
echo "   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo ""
echo "2. Replace the mock implementation in src/lib/supabase.ts with:"
echo "   import { createClient } from '@supabase/supabase-js';"
echo ""
echo "3. Create the campaign_uploads table in your Supabase dashboard" 