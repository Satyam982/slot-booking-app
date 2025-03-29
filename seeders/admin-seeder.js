const bcrypt = require('bcryptjs');
require('../config/database')
const userModel = require('../model/user.model');

async function seedAdmin() {
  // Move the await here
  const existingAdmin = await userModel.findOne({ isAdmin: true });

  if (!existingAdmin) {
    // Create admin credentials
    const adminCredentials = {
      firstName: "Admin",
      lastName: 'User',
      email: 'admin123@gmail.com',
      password: "admin@123",
      isAdmin: true,
      // Add other fields as needed
    };

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
    adminCredentials.password = hashedPassword;

    // Create admin user
    await userModel.create(adminCredentials);

    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exists");
  }
}

const runSeeder = async () => {
  await seedAdmin(); // Call the async function that performs the admin seeding
};

runSeeder(); // Call the runSeeder function to execute the seeding
