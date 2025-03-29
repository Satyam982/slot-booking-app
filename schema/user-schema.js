// validationSchemas.js
const { z } = require('zod');

const userRegistrationSchema = z.object({
    email: z.string()
    .email("Invalid email format")  // Ensures the email is in a valid format
    .refine(val => val.trim().length > 0, { message: "Email is required" }),  // Custom check for non-empty email
  password: z.string()
    .min(8, "Password must be at least 8 characters long")  // Ensures password is at least 8 characters long
    .refine(val => val.trim().length > 0, { message: "Password is required" }),  
});

module.exports = { userRegistrationSchema };
