-- Remove legacy tables/functions from earlier experimental features.
-- These objects are not part of the current production schema.

DROP FUNCTION IF EXISTS public.update_popular_name_stats(text, text);
DROP FUNCTION IF EXISTS public.check_ip_rate_limit(text);
DROP FUNCTION IF EXISTS public.check_ip_rate_limit(inet);
DROP FUNCTION IF EXISTS public.cleanup_old_ip_rate_limits();

DROP TABLE IF EXISTS public.name_generation_logs CASCADE;
DROP TABLE IF EXISTS public.saved_names CASCADE;
DROP TABLE IF EXISTS public.popular_names CASCADE;
DROP TABLE IF EXISTS public.ip_usage_logs CASCADE;
DROP TABLE IF EXISTS public.ip_rate_limits CASCADE;
