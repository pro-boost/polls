-- Supabase Database Schema for Polling Application
-- This file contains the complete database schema for polls and votes

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    allow_multiple_votes BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false
);

-- Create poll_options table
CREATE TABLE IF NOT EXISTS poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
    option_text VARCHAR(500) NOT NULL,
    option_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
    option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    voter_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one vote per user per poll (when not allowing multiple votes)
    UNIQUE(poll_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_created_by ON polls(created_by);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_polls_is_active ON polls(is_active);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes(option_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for polls table
CREATE TRIGGER update_polls_updated_at
    BEFORE UPDATE ON polls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls table
-- Anyone can view active polls
CREATE POLICY "Anyone can view active polls" ON polls
    FOR SELECT USING (is_active = true);

-- Users can view their own polls (including inactive ones)
CREATE POLICY "Users can view own polls" ON polls
    FOR SELECT USING (auth.uid() = created_by);

-- Authenticated users can create polls
CREATE POLICY "Authenticated users can create polls" ON polls
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Users can update their own polls
CREATE POLICY "Users can update own polls" ON polls
    FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own polls
CREATE POLICY "Users can delete own polls" ON polls
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for poll_options table
-- Anyone can view options for active polls
CREATE POLICY "Anyone can view poll options" ON poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.is_active = true
        )
    );

-- Poll creators can manage their poll options
CREATE POLICY "Poll creators can manage options" ON poll_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- RLS Policies for votes table
-- Users can view votes for active polls (for results)
CREATE POLICY "Anyone can view votes for active polls" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.is_active = true
        )
    );

-- Authenticated users can insert votes
CREATE POLICY "Authenticated users can vote" ON votes
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.is_active = true
            AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
        )
    );

-- Users can view their own votes
CREATE POLICY "Users can view own votes" ON votes
    FOR SELECT USING (auth.uid() = user_id);

-- Create a view for poll results
CREATE OR REPLACE VIEW poll_results AS
SELECT 
    p.id as poll_id,
    p.title,
    po.id as option_id,
    po.option_text,
    po.option_order,
    COUNT(v.id) as vote_count,
    ROUND(
        (COUNT(v.id)::DECIMAL / NULLIF(total_votes.total, 0)) * 100, 2
    ) as percentage
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id
LEFT JOIN votes v ON po.id = v.option_id
CROSS JOIN (
    SELECT 
        p2.id as poll_id,
        COUNT(v2.id) as total
    FROM polls p2
    LEFT JOIN poll_options po2 ON p2.id = po2.poll_id
    LEFT JOIN votes v2 ON po2.id = v2.option_id
    GROUP BY p2.id
) total_votes
WHERE total_votes.poll_id = p.id
GROUP BY p.id, p.title, po.id, po.option_text, po.option_order, total_votes.total
ORDER BY p.id, po.option_order;

-- Grant permissions on the view
GRANT SELECT ON poll_results TO authenticated, anon;

-- Create function to get poll with options
CREATE OR REPLACE FUNCTION get_poll_with_options(poll_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'poll', row_to_json(p),
        'options', COALESCE(options_array, '[]'::json)
    ) INTO result
    FROM polls p
    LEFT JOIN (
        SELECT 
            poll_id,
            json_agg(
                json_build_object(
                    'id', id,
                    'option_text', option_text,
                    'option_order', option_order
                ) ORDER BY option_order
            ) as options_array
        FROM poll_options
        WHERE poll_id = poll_uuid
        GROUP BY poll_id
    ) po ON p.id = po.poll_id
    WHERE p.id = poll_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_poll_with_options(UUID) TO authenticated, anon;

-- Create function to check if user has voted
CREATE OR REPLACE FUNCTION user_has_voted(poll_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM votes 
        WHERE poll_id = poll_uuid 
        AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION user_has_voted(UUID, UUID) TO authenticated, anon;