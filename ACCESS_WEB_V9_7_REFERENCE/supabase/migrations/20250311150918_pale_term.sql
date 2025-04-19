/*
  # Consolidated System Migration

  1. Tables
    - help_categories: Help center categories
    - help_articles: Help articles and content
    - subscriptions: User subscription records
    - subscription_features: Feature limits and usage tracking
    - subscription_usage: Usage history
    - usage_alerts: Usage alerts and notifications

  2. Security
    - Enable RLS on all tables
    - Drop existing policies to avoid conflicts
    - Create new policies with unique names and timestamps

  3. Functions
    - Article view tracking
    - Article voting
    - Subscription status checking
    - Usage tracking
    - Alert generation
*/

-- Drop existing policies and functions
DO $$ 
BEGIN
  -- Drop help center policies
  DROP POLICY IF EXISTS "Public can view help categories" ON help_categories;
  DROP POLICY IF EXISTS "Admins can manage help categories" ON help_categories;
  DROP POLICY IF EXISTS "Public can view published help articles" ON help_articles;
  DROP POLICY IF EXISTS "Admins can manage help articles" ON help_articles;

  -- Drop subscription policies
  DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Users can view own subscription features" ON subscription_features;
  DROP POLICY IF EXISTS "Users can view own usage" ON subscription_usage;
  DROP POLICY IF EXISTS "Users can view own alerts" ON usage_alerts;

  -- Drop existing functions
  DROP FUNCTION IF EXISTS increment_article_views(text);
  DROP FUNCTION IF EXISTS vote_article_helpful(text, boolean);
  DROP FUNCTION IF EXISTS check_subscription_status(uuid);
  DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);
  DROP FUNCTION IF EXISTS increment_feature_usage(uuid, text, integer);
  DROP FUNCTION IF EXISTS create_usage_alert(uuid, text);
END $$;

-- Create help_categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  slug text UNIQUE NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help_articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES help_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  views integer DEFAULT 0,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'past_due', 'cancelled')),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_features table
CREATE TABLE IF NOT EXISTS subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  max_value integer,
  current_value integer DEFAULT 0,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (subscription_id, feature_key)
);

-- Create subscription_usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer DEFAULT 0,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create usage_alerts table
CREATE TABLE IF NOT EXISTS usage_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  type text NOT NULL CHECK (type IN ('warning', 'critical')),
  message text NOT NULL,
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_alerts ENABLE ROW LEVEL SECURITY;

-- Create help center policies with unique names
CREATE POLICY "help_categories_public_select_20240311"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "help_categories_admin_all_20240311"
  ON help_categories
  FOR ALL
  TO authenticated
  USING (role() = 'admin');

CREATE POLICY "help_articles_public_select_20240311"
  ON help_articles
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "help_articles_admin_all_20240311"
  ON help_articles
  FOR ALL
  TO authenticated
  USING (role() = 'admin');

-- Create subscription policies with unique names
CREATE POLICY "subscriptions_user_select_20240311"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "subscription_features_select_20240311"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "subscription_usage_select_20240311"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "usage_alerts_select_20240311"
  ON usage_alerts
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Create help center functions
CREATE FUNCTION increment_article_views(article_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$;

CREATE FUNCTION vote_article_helpful(article_slug text, is_helpful boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF is_helpful THEN
    UPDATE help_articles
    SET helpful_votes = helpful_votes + 1
    WHERE slug = article_slug;
  ELSE
    UPDATE help_articles
    SET unhelpful_votes = unhelpful_votes + 1
    WHERE slug = article_slug;
  END IF;
END;
$$;

-- Create subscription functions
CREATE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'status', s.status,
    'plan', s.plan_id,
    'features', (
      SELECT json_object_agg(
        sf.feature_key,
        json_build_object(
          'max_value', sf.max_value,
          'current_value', sf.current_value,
          'is_enabled', sf.is_enabled
        )
      )
      FROM subscription_features sf
      WHERE sf.subscription_id = s.id
    ),
    'usage', (
      SELECT json_object_agg(
        su.feature_key,
        json_build_object(
          'daily', SUM(CASE WHEN su.usage_date = CURRENT_DATE THEN su.usage_count ELSE 0 END),
          'monthly', SUM(CASE WHEN su.usage_date >= date_trunc('month', CURRENT_DATE) THEN su.usage_count ELSE 0 END),
          'total', SUM(su.usage_count)
        )
      )
      FROM subscription_usage su
      WHERE su.subscription_id = s.id
      GROUP BY su.subscription_id
    )
  ) INTO v_result
  FROM subscriptions s
  WHERE s.id = p_subscription_id
  AND s.user_id = auth.uid();

  RETURN v_result;
END;
$$;

CREATE FUNCTION check_subscription_limit(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max_value integer;
  v_current_value integer;
BEGIN
  SELECT max_value, current_value
  INTO v_max_value, v_current_value
  FROM subscription_features sf
  JOIN subscriptions s ON s.id = sf.subscription_id
  WHERE sf.subscription_id = p_subscription_id
  AND sf.feature_key = p_feature_key
  AND s.user_id = auth.uid();

  -- If no max value, feature is unlimited
  IF v_max_value IS NULL THEN
    RETURN true;
  END IF;

  -- Check if increment would exceed limit
  RETURN (v_current_value + p_increment) <= v_max_value;
END;
$$;

CREATE FUNCTION increment_feature_usage(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user owns subscription
  IF NOT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE id = p_subscription_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Update current value
  UPDATE subscription_features
  SET current_value = current_value + p_increment
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Record usage
  INSERT INTO subscription_usage (
    subscription_id,
    feature_key,
    usage_count
  ) VALUES (
    p_subscription_id,
    p_feature_key,
    p_increment
  );

  -- Create alerts if needed
  PERFORM create_usage_alert(p_subscription_id, p_feature_key);
END;
$$;

CREATE FUNCTION create_usage_alert(
  p_subscription_id uuid,
  p_feature_key text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_feature record;
  v_usage_percent numeric;
BEGIN
  -- Verify user owns subscription
  IF NOT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE id = p_subscription_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Get feature info
  SELECT * INTO v_feature
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Calculate usage percentage
  IF v_feature.max_value IS NOT NULL AND v_feature.max_value > 0 THEN
    v_usage_percent := (v_feature.current_value::numeric / v_feature.max_value::numeric) * 100;

    -- Create warning alert at 80%
    IF v_usage_percent >= 80 AND v_usage_percent < 90 THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        type,
        message
      ) VALUES (
        p_subscription_id,
        p_feature_key,
        'warning',
        format('You have used %s%% of your %s limit', round(v_usage_percent), p_feature_key)
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- Create critical alert at 90%
    IF v_usage_percent >= 90 THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        type,
        message
      ) VALUES (
        p_subscription_id,
        p_feature_key,
        'critical',
        format('You have used %s%% of your %s limit', round(v_usage_percent), p_feature_key)
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- Insert initial help categories
INSERT INTO help_categories (name, description, icon, slug, "order") VALUES
('Getting Started', 'Learn the basics of using AccessWeb', 'Book', 'getting-started', 1),
('WCAG Guidelines', 'Detailed explanations of WCAG 2.1 requirements', 'FileText', 'wcag', 2),
('Integrations', 'Set up and use our platform integrations', 'Code', 'integrations', 3),
('Tools & Features', 'Learn about our accessibility testing tools', 'Settings', 'tools', 4),
('Compliance', 'Stay compliant with accessibility laws', 'Shield', 'compliance', 5),
('International', 'Global accessibility standards and requirements', 'Globe', 'international', 6);

-- Insert initial help article
INSERT INTO help_articles (category_id, title, slug, content, published) VALUES
(
  (SELECT id FROM help_categories WHERE slug = 'wcag'),
  'WCAG 2.1 Overview',
  'wcag-overview',
  '# WCAG 2.1 Overview

Web Content Accessibility Guidelines (WCAG) 2.1 defines how to make web content more accessible to people with disabilities. This guide provides a comprehensive overview of WCAG principles and requirements.

## Core Principles

WCAG 2.1 is organized around four principles:

1. **Perceivable** - Information must be presentable to users in ways they can perceive
2. **Operable** - Interface components must be operable
3. **Understandable** - Information and operation must be understandable
4. **Robust** - Content must be robust enough to work with current and future technologies

## Conformance Levels

WCAG 2.1 has three levels of conformance:

- **Level A** - Basic accessibility features
- **Level AA** - Addresses major accessibility barriers
- **Level AAA** - Highest level of accessibility

## Key Requirements

### Perceivable
- Text alternatives for non-text content
- Captions and audio descriptions
- Content adaptable and distinguishable

### Operable
- Keyboard accessible
- Enough time to read content
- No seizure-inducing content
- Navigable content

### Understandable
- Readable text
- Predictable functionality
- Input assistance

### Robust
- Compatible with assistive technologies
- Valid HTML/ARIA usage

## Implementation Guide

1. Start with semantic HTML
2. Add proper ARIA attributes when needed
3. Test with assistive technologies
4. Validate against WCAG criteria
5. Monitor and maintain compliance

## Resources

- [Official WCAG 2.1 Documentation](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG 2.1 Success Criteria](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Techniques for WCAG 2.1](https://www.w3.org/WAI/WCAG21/Techniques/)',
  true
);