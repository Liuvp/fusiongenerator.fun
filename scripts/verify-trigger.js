const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runTest() {
    const timestamp = Date.now();
    const testEmail = `test_auto_${timestamp}@example.com`;
    const testPassword = `Pass_${timestamp}!`;

    console.log(`\n🚀 Starting verification test...`);
    console.log(`👤 creating test user: ${testEmail}`);

    try {
        // 1. Create User (Simulate Sign Up)
        // Using admin.createUser automatically confirms email, which is good for testing logic quickly
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true
        });

        if (userError) throw userError;
        const userId = userData.user.id;
        console.log(`✅ User created successfully. ID: ${userId}`);

        // Wait a brief moment for the Trigger to fire
        console.log(`⏳ Waiting for database trigger to process...`);
        await new Promise(r => setTimeout(r, 2000));

        // 2. Verify Customer Record
        console.log(`🔍 Checking public.customers table...`);
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (customerError) {
            console.error(`❌ TEST FAILED: Could not find customer record. Trigger might be broken.`);
            console.error(customerError);
        } else {
            console.log(`✅ Verification Successful!`);
            console.log(`   - Customer Record Found`);
            console.log(`   - Email: ${customer.email}`);
            console.log(`   - Creem ID: ${customer.creem_customer_id} (Expected start with 'auto_')`);
            console.log(`   - Credits: ${customer.credits} (Expected: 3)`);

            if (customer.credits === 3 && customer.creem_customer_id.startsWith('auto_')) {
                console.log(`🎉 SYSTEM LOOKS HEALTHY! New users are getting credits correctly.`);
            } else {
                console.warn(`⚠️ Data warning: Credits or ID format mismatch.`);
            }
        }

        // 3. Cleanup
        console.log(`\n🧹 Cleaning up test data...`);
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) console.error('Failed to delete test user:', deleteError);
        else console.log(`✅ Test user deleted.`);

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

runTest();
