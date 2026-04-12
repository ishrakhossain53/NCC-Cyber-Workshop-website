const { Client, Databases } = require('node-appwrite');
const fs = require('fs');
require('dotenv').config();

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey('YOUR_API_KEY_HERE'); // You need to add your API key from Appwrite Console

const databases = new Databases(client);

async function exportUsersFromBackend() {
    try {
        console.log('🔄 Connecting to Appwrite backend...');
        
        // Fetch all users from the database with pagination
        let allUsers = [];
        let offset = 0;
        const limit = 100; // Fetch 100 at a time
        let hasMore = true;

        console.log('📥 Fetching users with pagination...');

        while (hasMore) {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
                [
                    `limit(${limit})`,
                    `offset(${offset})`
                ]
            );

            allUsers = allUsers.concat(response.documents);
            console.log(`   Fetched ${response.documents.length} users (offset: ${offset})`);
            
            // Check if there are more documents
            hasMore = response.documents.length === limit;
            offset += limit;
        }

        console.log(`✅ Total users found: ${allUsers.length}`);

        // Extract user data
        const userData = allUsers.map(user => ({
            id: user.$id,
            name: user.name,
            email: user.email,
            student_id: user.student_id,
            institution: user.institution,
            registration_status: user.registration_status,
            created_at: user.$createdAt,
            updated_at: user.$updatedAt
        }));

        // Create JSON structure
        const jsonData = {
            export_info: {
                exported_at: new Date().toISOString(),
                total_users: userData.length,
                export_type: "backend_users_export",
                workshop: "NCC Cyber Workshop 2026",
                source: "Appwrite Backend",
                pagination_used: true,
                fetch_limit_per_request: limit
            },
            users: userData
        };

        // Save to JSON file
        const filename = `ncc-users-backend-${new Date().toISOString().split('T')[0]}.json`;
        fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
        
        console.log(`📁 Exported ${userData.length} users to ${filename}`);
        
        // Also create a simple CSV for quick viewing
        const csvHeader = 'Name,Email,ID,Student ID,Institution,Status,Created Date\n';
        const csvRows = userData.map(user => 
            `"${user.name}","${user.email}","${user.id}","${user.student_id}","${user.institution}","${user.registration_status}","${new Date(user.created_at).toLocaleDateString()}"`
        ).join('\n');
        
        const csvFilename = `ncc-users-backend-${new Date().toISOString().split('T')[0]}.csv`;
        fs.writeFileSync(csvFilename, csvHeader + csvRows);
        
        console.log(`📊 Also exported CSV to ${csvFilename}`);
        console.log('\n📋 Summary:');
        console.log(`   Total Users: ${userData.length}`);
        console.log(`   JSON File: ${filename}`);
        console.log(`   CSV File: ${csvFilename}`);
        console.log(`   Pagination: Used (${limit} per request)`);

    } catch (error) {
        console.error('❌ Error exporting users:', error);
        
        if (error.code === 401) {
            console.log('\n🔑 Authentication Error:');
            console.log('   1. Go to Appwrite Console → Settings → API Keys');
            console.log('   2. Create a new API key with database read permissions');
            console.log('   3. Replace YOUR_API_KEY_HERE in this script with your actual API key');
        } else if (error.code === 404) {
            console.log('\n🗄️ Database/Collection Not Found:');
            console.log('   1. Check your .env file has correct database and collection IDs');
            console.log('   2. Verify the users collection exists in Appwrite Console');
        }
    }
}

// Run the export
console.log('🚀 Starting NCC Workshop Users Export...\n');
exportUsersFromBackend();