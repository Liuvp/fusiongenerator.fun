-- Fix existing users' credits from 3 to 1 to match the free tier policy
-- Date: 2026-02-11

-- Update all customers with 3 credits to 1 credit (free tier should be 1, not 3)
UPDATE public.customers
SET
  credits = 1,
  updated_at = NOW(),
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'credits_corrected_to_1', NOW(), 
    'reason', 'match_free_tier_policy',
    'previous_credits', 3
  )
WHERE credits = 3
AND created_at > '2024-12-30'  -- Only affect users created after the previous fix
AND (
  metadata->>'source' = 'chinese_name_generator' 
  OR metadata->>'initial_credits' = '3'
  OR metadata IS NULL
);

-- Add credit history for the correction
INSERT INTO public.credits_history (
  customer_id,
  amount,
  type,
  description,
  created_at,
  metadata
)
SELECT 
  c.id,
  -2, -- Remove 2 credits (3 -> 1)
  'subtract',
  'Corrected credits from 3 to 1 to match free tier policy (1 free generation)',
  NOW(),
  jsonb_build_object(
    'source', 'free_tier_policy_correction',
    'from_credits', 3,
    'to_credits', 1,
    'correction_date', NOW(),
    'reason', 'Unified free tier: 1 generation for both anonymous and registered users'
  )
FROM public.customers c
WHERE c.credits = 1
AND c.metadata->>'reason' = 'match_free_tier_policy'
AND c.updated_at > NOW() - INTERVAL '5 minutes';  -- Only for records just updated

-- Show summary
DO $$
DECLARE
    total_affected integer;
    total_customers integer;
    customers_with_1_credit integer;
    customers_with_more integer;
BEGIN
    SELECT COUNT(*) INTO total_affected 
    FROM public.customers 
    WHERE metadata->>'reason' = 'match_free_tier_policy';
    
    SELECT COUNT(*) INTO total_customers 
    FROM public.customers;
    
    SELECT COUNT(*) INTO customers_with_1_credit 
    FROM public.customers 
    WHERE credits = 1;
    
    SELECT COUNT(*) INTO customers_with_more 
    FROM public.customers 
    WHERE credits > 1;
    
    RAISE NOTICE '=== Free Tier Credits Correction Summary ===';
    RAISE NOTICE 'Total customers affected: %', total_affected;
    RAISE NOTICE 'Total customers in database: %', total_customers;
    RAISE NOTICE 'Customers with 1 credit (free tier): %', customers_with_1_credit;
    RAISE NOTICE 'Customers with more than 1 credit: % (VIP or topped up)', customers_with_more;
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Free tier policy: 1 generation for both anonymous and registered users';
END $$;
