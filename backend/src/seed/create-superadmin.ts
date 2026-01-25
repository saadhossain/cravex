import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../domain/entities/user.entity';

async function createSuperAdmin() {
  console.log('🔐 Creating superadmin user...');

  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    const userRepository = AppDataSource.getRepository(User);

    // Check if superadmin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@cravex.com' },
    });

    if (existingAdmin) {
      console.log('⚠️ Superadmin already exists. Skipping creation.');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);

      // Update to superadmin role if not already
      if (existingAdmin.role !== 'superadmin') {
        existingAdmin.role = 'superadmin';
        await userRepository.save(existingAdmin);
        console.log('✅ Updated existing user to superadmin role.');
      }
    } else {
      const hashedPassword = await bcrypt.hash('Password123!', 10);

      const superadmin = userRepository.create({
        email: 'admin@cravex.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+44 20 7000 0000',
        role: 'superadmin',
        isActive: true,
        isEmailVerified: true,
      });

      await userRepository.save(superadmin);
      console.log('✅ Superadmin user created successfully!');
    }

    console.log('\n📝 Superadmin Credentials:');
    console.log('   Email: admin@cravex.com');
    console.log('   Password: Password123!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Failed to create superadmin:', error);
    process.exit(1);
  }
}

createSuperAdmin();
