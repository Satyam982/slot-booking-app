const bcrypt = require('bcryptjs');
require('../config/database')
const userModel = require('../model/user.model');

async function seedUser() {
  // Move the await here
  const existingAdmin = await userModel.findOne({ email: 'nirav123@gmail.com' });

  if (!existingAdmin) {
    // Create admin credentials
    const adminCredentials = {
      firstName: "Nirav",
      lastName: 'Darji',
      email: 'nirav123@gmail.com',
      password: "nirav123@123",
      // Add other fields as needed
    };

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
    adminCredentials.password = hashedPassword;

    // Create admin user
    await userModel.create(adminCredentials);

    console.log("user created successfully");
  } else {
    console.log("user already exists");
  }
}

const runSeeder = async () => {
  await seedUser(); // Call the async function that performs the admin seeding
};

runSeeder(); // Call the runSeeder function to execute the seeding
