// Test script for browser console
// Copy and paste this into browser console to test login

console.log('🧪 Testing Login from Browser Console');

// Test function
async function testLogin() {
    try {
        console.log('🔐 Testing login with admin@mia.vn');

        // Import userService dynamically
        const { userService } = await import('/src/services/user/userService.js');

        // Find user
        const user = await userService.getUserByEmail('admin@mia.vn');

        if (user) {
            console.log('✅ User found:', user);
            console.log('🎉 Login would succeed!');
            return user;
        } else {
            console.log('❌ User not found');
            return null;
        }

    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// Run test
testLogin();
