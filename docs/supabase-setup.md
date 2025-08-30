# Supabase Database Setup for Polling Application

This guide explains how to set up the Supabase database schema for the polling application.

## Prerequisites

- A Supabase project created at [supabase.com](https://supabase.com)
- Access to the Supabase SQL Editor or CLI

## Database Schema Overview

The polling application uses the following database structure:

### Tables

1. **polls** - Stores poll information
   - `id` (UUID, Primary Key)
   - `title` (VARCHAR, Required)
   - `description` (TEXT, Optional)
   - `created_by` (UUID, Foreign Key to auth.users)
   - `created_at`, `updated_at` (Timestamps)
   - `expires_at` (Timestamp, Optional)
   - `is_active` (Boolean)
   - `allow_multiple_votes` (Boolean)
   - `is_anonymous` (Boolean)

2. **poll_options** - Stores poll answer options
   - `id` (UUID, Primary Key)
   - `poll_id` (UUID, Foreign Key to polls)
   - `option_text` (VARCHAR, Required)
   - `option_order` (Integer)
   - `created_at` (Timestamp)

3. **votes** - Stores user votes
   - `id` (UUID, Primary Key)
   - `poll_id` (UUID, Foreign Key to polls)
   - `option_id` (UUID, Foreign Key to poll_options)
   - `user_id` (UUID, Foreign Key to auth.users, Optional for anonymous votes)
   - `voter_ip` (INET, For anonymous vote tracking)
   - `created_at` (Timestamp)

### Views

- **poll_results** - Aggregated view showing vote counts and percentages

### Functions

- `get_poll_with_options(poll_uuid)` - Returns poll with its options
- `user_has_voted(poll_uuid, user_uuid)` - Checks if user has voted

## Setup Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open your Supabase project dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project

2. **Access the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the schema**
   - Copy the entire contents of `supabase_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

### Method 2: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link your project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run the migration**
   ```bash
   supabase db push
   ```

## Row Level Security (RLS) Policies

The schema includes comprehensive RLS policies:

### Polls Table
- **Public Read**: Anyone can view active polls
- **Owner Read**: Users can view all their own polls
- **Authenticated Create**: Authenticated users can create polls
- **Owner Update/Delete**: Users can modify their own polls

### Poll Options Table
- **Public Read**: Anyone can view options for active polls
- **Owner Manage**: Poll creators can manage their poll options

### Votes Table
- **Public Read**: Anyone can view votes for active polls (for results)
- **Authenticated Vote**: Authenticated users can submit votes
- **Owner Read**: Users can view their own votes

## Environment Variables

After setting up the database, update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Verification

To verify the setup worked correctly:

1. **Check Tables**
   - Go to "Table Editor" in Supabase dashboard
   - Verify `polls`, `poll_options`, and `votes` tables exist

2. **Check RLS Policies**
   - Go to "Authentication" > "Policies"
   - Verify policies are enabled for all tables

3. **Test Functions**
   - In SQL Editor, run:
   ```sql
   SELECT get_poll_with_options('00000000-0000-0000-0000-000000000000');
   ```

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure RLS is properly configured
   - Check that policies allow the intended operations

2. **Function Not Found**
   - Verify functions were created successfully
   - Check function permissions with `GRANT EXECUTE`

3. **Foreign Key Constraints**
   - Ensure `auth.users` table exists (it's created automatically)
   - Verify UUID format in test data

### Reset Database (if needed)

If you need to start over:

```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP VIEW IF EXISTS poll_results CASCADE;
DROP FUNCTION IF EXISTS get_poll_with_options(UUID);
DROP FUNCTION IF EXISTS user_has_voted(UUID, UUID);
```

Then re-run the schema file.

## Next Steps

After setting up the database:

1. Update your Supabase client configuration
2. Test the API endpoints in your application
3. Create sample polls to verify functionality
4. Set up authentication if not already configured

## Support

For issues with this setup:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the application's API implementation in `/lib/api.ts`
- Ensure your TypeScript types match the database schema in `/types/database.ts`