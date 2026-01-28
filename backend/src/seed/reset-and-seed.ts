import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { Category } from '../domain/entities/category.entity';
import { Coupon } from '../domain/entities/coupon.entity';
import { MenuItem } from '../domain/entities/menu-item.entity';
import { OrderItem } from '../domain/entities/order-item.entity';
import { Order, OrderStatus } from '../domain/entities/order.entity';
import { Restaurant } from '../domain/entities/restaurant.entity';
import { User } from '../domain/entities/user.entity';

async function resetAndSeed() {
  console.log('🌱 Starting database reset and seeding...');

  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const categoryRepository = AppDataSource.getRepository(Category);
    const menuItemRepository = AppDataSource.getRepository(MenuItem);
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const couponRepository = AppDataSource.getRepository(Coupon);

    // ===================================
    // STEP 1: Clear all existing data
    // ===================================
    console.log('🗑️ Clearing existing data...');

    // Use raw SQL to truncate tables with CASCADE to handle FK constraints
    await AppDataSource.query('TRUNCATE TABLE order_items CASCADE');
    console.log('   ✓ Order items cleared');

    await AppDataSource.query('TRUNCATE TABLE orders CASCADE');
    console.log('   ✓ Orders cleared');

    await AppDataSource.query('TRUNCATE TABLE coupons CASCADE');
    console.log('   ✓ Coupons cleared');

    await AppDataSource.query('TRUNCATE TABLE menu_items CASCADE');
    console.log('   ✓ Menu items (dishes) cleared');

    await AppDataSource.query('TRUNCATE TABLE categories CASCADE');
    console.log('   ✓ Categories cleared');

    await AppDataSource.query('TRUNCATE TABLE restaurants CASCADE');
    console.log('   ✓ Restaurants cleared');

    // Delete non-superadmin users
    await AppDataSource.query(`DELETE FROM users WHERE role != 'superadmin'`);
    console.log('   ✓ Users cleared (keeping superadmin)');

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // ===================================
    // STEP 2: Create Restaurant Owners
    // ===================================
    console.log('\n👥 Creating restaurant owners...');

    const ownerData = [
      {
        email: 'owner@mcdonalds.com',
        firstName: 'Ronald',
        lastName: 'McDonald',
        phone: '+1 800 244 6227',
      },
      {
        email: 'owner@papajohns.com',
        firstName: 'John',
        lastName: 'Schnatter',
        phone: '+1 877 547 7272',
      },
      {
        email: 'owner@kfc.com',
        firstName: 'Harland',
        lastName: 'Sanders',
        phone: '+1 800 225 5532',
      },
      {
        email: 'owner@testys.com',
        firstName: 'Carlos',
        lastName: 'Garcia',
        phone: '+1 555 123 4567',
      },
      {
        email: 'owner@shawarmaking.com',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        phone: '+1 555 234 5678',
      },
      {
        email: 'owner@burgerking.com',
        firstName: 'James',
        lastName: 'McLamore',
        phone: '+1 866 394 2493',
      },
      {
        email: 'owner@subway.com',
        firstName: 'Fred',
        lastName: 'DeLuca',
        phone: '+1 800 888 4848',
      },
      {
        email: 'owner@dominos.com',
        firstName: 'Tom',
        lastName: 'Monaghan',
        phone: '+1 734 930 3030',
      },
      {
        email: 'owner@pizzahut.com',
        firstName: 'Dan',
        lastName: 'Carney',
        phone: '+1 800 948 8488',
      },
      {
        email: 'owner@healthybites.com',
        firstName: 'Sarah',
        lastName: 'Green',
        phone: '+1 555 345 6789',
      },
    ];

    const owners: User[] = [];
    for (const data of ownerData) {
      const owner = userRepository.create({
        ...data,
        password: hashedPassword,
        role: 'restaurant',
        isActive: true,
        isEmailVerified: true,
      });
      owners.push(await userRepository.save(owner));
    }
    console.log(`   ✓ Created ${owners.length} restaurant owners`);

    // ===================================
    // STEP 3: Create Customer Users
    // ===================================
    console.log('\n👥 Creating customer users...');

    const customerData = [
      {
        email: 'john.doe@email.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 555 111 1111',
      },
      {
        email: 'jane.smith@email.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 555 222 2222',
      },
      {
        email: 'mike.wilson@email.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        phone: '+1 555 333 3333',
      },
      {
        email: 'emily.brown@email.com',
        firstName: 'Emily',
        lastName: 'Brown',
        phone: '+1 555 444 4444',
      },
      {
        email: 'david.lee@email.com',
        firstName: 'David',
        lastName: 'Lee',
        phone: '+1 555 555 5555',
      },
    ];

    const customers: User[] = [];
    for (const data of customerData) {
      const customer = userRepository.create({
        ...data,
        password: hashedPassword,
        role: 'customer',
        isActive: true,
        isEmailVerified: true,
      });
      customers.push(await userRepository.save(customer));
    }
    console.log(`   ✓ Created ${customers.length} customers`);

    // ===================================
    // STEP 4: Create Restaurants
    // ===================================
    console.log('\n🍕 Creating restaurants...');

    const defaultOpeningHours = {
      monday: { open: '09:00', close: '23:00', isClosed: false },
      tuesday: { open: '09:00', close: '23:00', isClosed: false },
      wednesday: { open: '09:00', close: '23:00', isClosed: false },
      thursday: { open: '09:00', close: '23:00', isClosed: false },
      friday: { open: '09:00', close: '00:00', isClosed: false },
      saturday: { open: '10:00', close: '00:00', isClosed: false },
      sunday: { open: '10:00', close: '22:00', isClosed: false },
    };

    const restaurantData = [
      {
        name: "McDonald's",
        slug: 'mcdonalds',
        description: "The world's leading fast-food restaurant chain.",
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/800px-McDonald%27s_Golden_Arches.svg.png',
        rating: 4.5,
        reviewCount: 2547,
        address: '123 Main Street, New York, NY 10001',
        deliveryFee: 2.99,
        deliveryTimeMinutes: 25,
        isFeatured: true,
        cuisineTypes: ['Fast Food', 'American', 'Burgers'],
        ownerIdx: 0,
      },
      {
        name: "Papa John's",
        slug: 'papa-johns',
        description: 'Better Ingredients, Better Pizza.',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Papa_Johns_Logo_2019.svg/800px-Papa_Johns_Logo_2019.svg.png',
        rating: 4.6,
        reviewCount: 1823,
        address: '456 Pizza Lane, Chicago, IL 60601',
        deliveryFee: 3.49,
        deliveryTimeMinutes: 35,
        isFeatured: true,
        cuisineTypes: ['Pizza', 'Italian'],
        ownerIdx: 1,
      },
      {
        name: 'KFC',
        slug: 'kfc',
        description: "Kentucky Fried Chicken - Finger lickin' good!",
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/800px-KFC_logo.svg.png',
        rating: 4.4,
        reviewCount: 1956,
        address: '789 Chicken Road, Louisville, KY 40202',
        deliveryFee: 2.49,
        deliveryTimeMinutes: 30,
        isFeatured: true,
        cuisineTypes: ['Chicken', 'Fast Food'],
        ownerIdx: 2,
      },
      {
        name: "Testy's",
        slug: 'testys',
        description: 'Authentic Mexican flavors with a modern twist.',
        logoUrl:
          'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200',
        rating: 4.7,
        reviewCount: 892,
        address: '321 Taco Street, Los Angeles, CA 90001',
        deliveryFee: 1.99,
        deliveryTimeMinutes: 20,
        isFeatured: true,
        cuisineTypes: ['Mexican', 'Tacos'],
        ownerIdx: 3,
      },
      {
        name: 'Shawarma King',
        slug: 'shawarma-king',
        description: 'The king of Middle Eastern cuisine.',
        logoUrl:
          'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=200',
        rating: 4.8,
        reviewCount: 1234,
        address: '555 Mediterranean Ave, Miami, FL 33101',
        deliveryFee: 2.99,
        deliveryTimeMinutes: 25,
        isFeatured: true,
        cuisineTypes: ['Middle Eastern', 'Halal'],
        ownerIdx: 4,
      },
      {
        name: 'Burger King',
        slug: 'burger-king',
        description: 'Have it your way! Home of the Whopper.',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/800px-Burger_King_logo_%281999%29.svg.png',
        rating: 4.3,
        reviewCount: 2156,
        address: '666 Whopper Drive, Dallas, TX 75201',
        deliveryFee: 2.99,
        deliveryTimeMinutes: 28,
        isFeatured: false,
        cuisineTypes: ['Fast Food', 'Burgers'],
        ownerIdx: 5,
      },
      {
        name: 'Subway',
        slug: 'subway',
        description: 'Eat Fresh! Build your perfect sub.',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/800px-Subway_2016_logo.svg.png',
        rating: 4.5,
        reviewCount: 1678,
        address: '777 Fresh Street, Boston, MA 02101',
        deliveryFee: 1.49,
        deliveryTimeMinutes: 15,
        isFeatured: false,
        cuisineTypes: ['Sandwiches', 'Healthy'],
        ownerIdx: 6,
      },
      {
        name: "Domino's",
        slug: 'dominos',
        description: 'Pizza delivery experts!',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dominos_pizza_logo.svg/800px-Dominos_pizza_logo.svg.png',
        rating: 4.4,
        reviewCount: 2034,
        address: '888 Delivery Lane, Detroit, MI 48201',
        deliveryFee: 0,
        deliveryTimeMinutes: 35,
        isFeatured: false,
        cuisineTypes: ['Pizza', 'Italian'],
        ownerIdx: 7,
      },
      {
        name: 'Pizza Hut',
        slug: 'pizza-hut',
        description: 'Making it great since 1958!',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/sco/thumb/d/d2/Pizza_Hut_logo.svg/800px-Pizza_Hut_logo.svg.png',
        rating: 4.6,
        reviewCount: 1876,
        address: '999 Hut Plaza, Wichita, KS 67201',
        deliveryFee: 2.99,
        deliveryTimeMinutes: 35,
        isFeatured: true,
        cuisineTypes: ['Pizza', 'Italian'],
        ownerIdx: 8,
      },
      {
        name: 'Healthy Bites',
        slug: 'healthy-bites',
        description: 'Fresh, nutritious, and delicious!',
        logoUrl:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
        rating: 4.9,
        reviewCount: 567,
        address: '100 Wellness Way, San Francisco, CA 94101',
        deliveryFee: 3.99,
        deliveryTimeMinutes: 20,
        isFeatured: true,
        cuisineTypes: ['Healthy', 'Salads', 'Organic'],
        ownerIdx: 9,
      },
    ];

    const restaurants: Restaurant[] = [];
    for (const data of restaurantData) {
      const { ownerIdx, ...restData } = data;
      const restaurant = restaurantRepository.create({
        ...restData,
        openingHours: defaultOpeningHours,
        minimumDelivery: 10.0,
        isActive: true,
        ownerId: owners[ownerIdx].id,
      });
      restaurants.push(await restaurantRepository.save(restaurant));
    }
    console.log(`   ✓ Created ${restaurants.length} restaurants`);

    // ===================================
    // STEP 5: Create Categories
    // ===================================
    console.log('\n📂 Creating categories...');

    const categoryData = [
      // McDonald's
      {
        name: 'Burgers',
        slug: 'mcdonalds-burgers',
        description: 'Our famous burgers',
        displayOrder: 1,
        restaurantIdx: 0,
      },
      {
        name: 'Chicken',
        slug: 'mcdonalds-chicken',
        description: 'Crispy chicken favorites',
        displayOrder: 2,
        restaurantIdx: 0,
      },
      {
        name: 'Breakfast',
        slug: 'mcdonalds-breakfast',
        description: 'Start your day right',
        displayOrder: 3,
        restaurantIdx: 0,
      },
      // Papa John's
      {
        name: 'Pizza',
        slug: 'papajohns-pizza',
        description: 'Better ingredients, better pizza',
        displayOrder: 1,
        restaurantIdx: 1,
      },
      {
        name: 'Sides',
        slug: 'papajohns-sides',
        description: 'Perfect accompaniments',
        displayOrder: 2,
        restaurantIdx: 1,
      },
      // KFC
      {
        name: 'Chicken',
        slug: 'kfc-chicken',
        description: "Finger lickin' good",
        displayOrder: 1,
        restaurantIdx: 2,
      },
      {
        name: 'Burgers',
        slug: 'kfc-burgers',
        description: 'Chicken burgers',
        displayOrder: 2,
        restaurantIdx: 2,
      },
      // Testy's
      {
        name: 'Tacos',
        slug: 'testys-tacos',
        description: 'Authentic Mexican tacos',
        displayOrder: 1,
        restaurantIdx: 3,
      },
      {
        name: 'Burritos',
        slug: 'testys-burritos',
        description: 'Loaded burritos',
        displayOrder: 2,
        restaurantIdx: 3,
      },
      // Shawarma King
      {
        name: 'Shawarma',
        slug: 'shawarmaking-shawarma',
        description: 'Grilled to perfection',
        displayOrder: 1,
        restaurantIdx: 4,
      },
      {
        name: 'Salads',
        slug: 'shawarmaking-salads',
        description: 'Fresh Mediterranean salads',
        displayOrder: 2,
        restaurantIdx: 4,
      },
      // Burger King
      {
        name: 'Burgers',
        slug: 'burgerking-burgers',
        description: 'Flame-grilled burgers',
        displayOrder: 1,
        restaurantIdx: 5,
      },
      {
        name: 'Chicken',
        slug: 'burgerking-chicken',
        description: 'Crispy chicken items',
        displayOrder: 2,
        restaurantIdx: 5,
      },
      // Subway
      {
        name: 'Subs',
        slug: 'subway-subs',
        description: 'Build your sub',
        displayOrder: 1,
        restaurantIdx: 6,
      },
      {
        name: 'Salads',
        slug: 'subway-salads',
        description: 'Fresh salads',
        displayOrder: 2,
        restaurantIdx: 6,
      },
      // Domino's
      {
        name: 'Pizza',
        slug: 'dominos-pizza',
        description: 'Hot & fresh pizza',
        displayOrder: 1,
        restaurantIdx: 7,
      },
      {
        name: 'Sides',
        slug: 'dominos-sides',
        description: 'Sides & starters',
        displayOrder: 2,
        restaurantIdx: 7,
      },
      // Pizza Hut
      {
        name: 'Pizza',
        slug: 'pizzahut-pizza',
        description: 'Making it great',
        displayOrder: 1,
        restaurantIdx: 8,
      },
      {
        name: 'Pasta',
        slug: 'pizzahut-pasta',
        description: 'Italian pasta',
        displayOrder: 2,
        restaurantIdx: 8,
      },
      // Healthy Bites
      {
        name: 'Salads',
        slug: 'healthybites-salads',
        description: 'Fresh organic salads',
        displayOrder: 1,
        restaurantIdx: 9,
      },
      {
        name: 'Bowls',
        slug: 'healthybites-bowls',
        description: 'Nutritious grain bowls',
        displayOrder: 2,
        restaurantIdx: 9,
      },
      {
        name: 'Smoothies',
        slug: 'healthybites-smoothies',
        description: 'Fresh fruit smoothies',
        displayOrder: 3,
        restaurantIdx: 9,
      },
    ];

    const categories: Category[] = [];
    for (const data of categoryData) {
      const { restaurantIdx, ...restData } = data;
      const category = categoryRepository.create({
        ...restData,
        isActive: true,
        restaurantId: restaurants[restaurantIdx].id,
      });
      categories.push(await categoryRepository.save(category));
    }
    console.log(`   ✓ Created ${categories.length} categories`);

    // ===================================
    // STEP 6: Create Dishes (Menu Items)
    // ===================================
    console.log('\n🍔 Creating dishes (menu items)...');

    // Helper to find category by slug
    const findCategory = (slug: string) =>
      categories.find((c) => c.slug === slug);

    const dishData = [
      // McDonald's
      {
        name: 'Big Mac',
        description:
          'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions',
        price: 5.99,
        imageUrl:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isPopular: true,
        preparationTime: 8,
        categorySlug: 'mcdonalds-burgers',
      },
      {
        name: 'Quarter Pounder with Cheese',
        description: 'Fresh beef patty with cheese, pickles, onions, ketchup',
        price: 6.49,
        imageUrl:
          'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        isPopular: true,
        preparationTime: 10,
        categorySlug: 'mcdonalds-burgers',
      },
      {
        name: 'McChicken',
        description: 'Crispy chicken patty with mayonnaise and lettuce',
        price: 4.49,
        imageUrl:
          'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
        isPopular: true,
        preparationTime: 7,
        categorySlug: 'mcdonalds-chicken',
      },
      {
        name: 'Chicken McNuggets (10pc)',
        description: '10 piece tender chicken McNuggets',
        price: 6.99,
        imageUrl:
          'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
        isPopular: true,
        preparationTime: 6,
        categorySlug: 'mcdonalds-chicken',
      },
      {
        name: 'Egg McMuffin',
        description: 'Egg, Canadian bacon, and cheese on English muffin',
        price: 3.99,
        imageUrl:
          'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
        isPopular: true,
        preparationTime: 5,
        categorySlug: 'mcdonalds-breakfast',
      },
      // Papa John's
      {
        name: 'Pepperoni Pizza',
        description: 'Loaded with premium pepperoni and melted cheese',
        price: 14.99,
        originalPrice: 18.99,
        imageUrl: '/images/home/pizza.png',
        isPopular: true,
        preparationTime: 30,
        categorySlug: 'papajohns-pizza',
      },
      {
        name: 'The Works Pizza',
        description: 'Pepperoni, sausage, mushrooms, onions, peppers',
        price: 17.99,
        imageUrl:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        isPopular: false,
        preparationTime: 32,
        categorySlug: 'papajohns-pizza',
      },
      {
        name: 'Cheesesticks',
        description: 'Baked breadsticks topped with cheese and garlic',
        price: 6.99,
        imageUrl:
          'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400',
        isPopular: true,
        preparationTime: 15,
        categorySlug: 'papajohns-sides',
      },
      // KFC
      {
        name: 'Crispy Fried Chicken',
        description:
          "Original Recipe chicken with 11 herbs and spices - finger lickin' good!",
        price: 8.99,
        originalPrice: 12.99,
        imageUrl: '/images/home/fried-chicken.png',
        isPopular: true,
        preparationTime: 25,
        categorySlug: 'kfc-chicken',
      },
      {
        name: 'Extra Crispy Chicken',
        description: 'Extra crispy coating for extra crunch',
        price: 9.49,
        imageUrl:
          'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
        isPopular: true,
        preparationTime: 25,
        categorySlug: 'kfc-chicken',
      },
      {
        name: 'Chicken Sandwich',
        description: 'Crispy chicken fillet with pickles and mayo',
        price: 5.99,
        imageUrl:
          'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
        isPopular: true,
        preparationTime: 10,
        categorySlug: 'kfc-burgers',
      },
      // Testy's
      {
        name: 'Street Tacos (3pc)',
        description: 'Authentic street-style tacos with cilantro and onions',
        price: 8.99,
        imageUrl:
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
        isPopular: true,
        isSpicy: true,
        spicyLevel: 2,
        preparationTime: 12,
        categorySlug: 'testys-tacos',
      },
      {
        name: 'Loaded Burrito',
        description: 'Giant burrito with rice, beans, meat, cheese, sour cream',
        price: 11.99,
        imageUrl:
          'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        isPopular: true,
        preparationTime: 15,
        categorySlug: 'testys-burritos',
      },
      // Shawarma King
      {
        name: 'Chicken Shawarma Wrap',
        description: 'Tender grilled chicken wrapped in fresh pita',
        price: 9.99,
        imageUrl:
          'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400',
        isPopular: true,
        preparationTime: 15,
        categorySlug: 'shawarmaking-shawarma',
      },
      {
        name: 'Mixed Shawarma Plate',
        description: 'Chicken and beef shawarma with hummus and salad',
        price: 15.99,
        imageUrl:
          'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400',
        isPopular: true,
        preparationTime: 20,
        categorySlug: 'shawarmaking-shawarma',
      },
      {
        name: 'Fattoush Salad',
        description: 'Fresh Mediterranean salad with crispy pita chips',
        price: 7.99,
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        isPopular: false,
        isVegetarian: true,
        preparationTime: 10,
        categorySlug: 'shawarmaking-salads',
      },
      // Burger King
      {
        name: 'Classic Cheeseburger',
        description: 'Flame-grilled beef patty with American cheese',
        price: 6.59,
        originalPrice: 10.99,
        imageUrl: '/images/home/burger.png',
        isPopular: true,
        preparationTime: 20,
        categorySlug: 'burgerking-burgers',
      },
      {
        name: 'Whopper',
        description: 'Quarter pound of flame-grilled beef with fresh veggies',
        price: 7.99,
        imageUrl:
          'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        isPopular: true,
        preparationTime: 12,
        categorySlug: 'burgerking-burgers',
      },
      {
        name: 'Chicken Fries',
        description: 'Crispy chicken strips shaped like fries',
        price: 4.99,
        imageUrl:
          'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
        isPopular: true,
        preparationTime: 8,
        categorySlug: 'burgerking-chicken',
      },
      // Subway
      {
        name: 'Italian BMT',
        description: 'Genoa salami, spicy pepperoni, and Black Forest ham',
        price: 8.99,
        imageUrl:
          'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
        isPopular: true,
        preparationTime: 8,
        categorySlug: 'subway-subs',
      },
      {
        name: 'Turkey Breast',
        description: 'Lean, tender turkey breast with fresh veggies',
        price: 7.99,
        imageUrl:
          'https://images.unsplash.com/photo-1626078288220-1a1e91f7cecc?w=400',
        isPopular: true,
        preparationTime: 7,
        categorySlug: 'subway-subs',
      },
      {
        name: 'Veggie Delite Salad',
        description: 'Crisp veggies on a bed of lettuce',
        price: 5.99,
        imageUrl:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        isVegetarian: true,
        isVegan: true,
        preparationTime: 5,
        categorySlug: 'subway-salads',
      },
      // Domino's
      {
        name: 'ExtravaganZZa',
        description: 'Pepperoni, ham, Italian sausage, beef, mushrooms',
        price: 16.99,
        imageUrl:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        isPopular: true,
        preparationTime: 28,
        categorySlug: 'dominos-pizza',
      },
      {
        name: 'Cheese Pizza',
        description: 'Classic cheese pizza with our signature sauce',
        price: 10.99,
        imageUrl:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        isPopular: true,
        isVegetarian: true,
        preparationTime: 25,
        categorySlug: 'dominos-pizza',
      },
      {
        name: 'Breadsticks',
        description: 'Soft, garlic-seasoned breadsticks with marinara',
        price: 5.99,
        imageUrl:
          'https://images.unsplash.com/photo-1619531039089-5bcd47ff35e5?w=400',
        preparationTime: 15,
        categorySlug: 'dominos-sides',
      },
      // Pizza Hut
      {
        name: 'Meat Lovers',
        description: 'Pepperoni, Italian sausage, ham, bacon',
        price: 18.99,
        imageUrl:
          'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        isPopular: true,
        preparationTime: 30,
        categorySlug: 'pizzahut-pizza',
      },
      {
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, bell peppers, onions, mushrooms',
        price: 16.99,
        imageUrl:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        isPopular: true,
        preparationTime: 30,
        categorySlug: 'pizzahut-pizza',
      },
      {
        name: 'Tuscani Pasta',
        description: 'Creamy chicken alfredo pasta baked with cheese',
        price: 11.99,
        imageUrl:
          'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        preparationTime: 20,
        categorySlug: 'pizzahut-pasta',
      },
      // Healthy Bites
      {
        name: 'Fresh Garden Salad',
        description: 'Mixed greens with cherry tomatoes, cucumbers',
        price: 11.99,
        originalPrice: 14.99,
        imageUrl: '/images/home/fresh-salad.png',
        isPopular: true,
        isVegetarian: true,
        isVegan: true,
        calories: 180,
        preparationTime: 15,
        categorySlug: 'healthybites-salads',
      },
      {
        name: 'Mediterranean Bowl',
        description: 'Quinoa, falafel, hummus, tabbouleh, tzatziki',
        price: 13.99,
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        isPopular: true,
        isVegetarian: true,
        calories: 520,
        preparationTime: 12,
        categorySlug: 'healthybites-bowls',
      },
      {
        name: 'Green Power Smoothie',
        description: 'Spinach, kale, banana, mango, coconut water',
        price: 6.99,
        imageUrl:
          'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400',
        isPopular: true,
        isVegetarian: true,
        isVegan: true,
        calories: 210,
        preparationTime: 5,
        categorySlug: 'healthybites-smoothies',
      },
    ];

    const allDishes: MenuItem[] = [];
    for (const data of dishData) {
      const { categorySlug, ...restData } = data;
      const category = findCategory(categorySlug);
      if (!category) continue;

      const dish = menuItemRepository.create({
        ...restData,
        isAvailable: true,
        categoryId: category.id,
      });
      allDishes.push(await menuItemRepository.save(dish));
    }
    console.log(`   ✓ Created ${allDishes.length} dishes`);

    // ===================================
    // STEP 7: Create Sample Orders
    // ===================================
    console.log('\n📦 Creating sample orders...');

    const statuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];
    const allOrders: Order[] = [];

    const generateOrderNumber = (index: number): string => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `ORD-${year}${month}-${(1000 + index).toString()}`;
    };

    for (let i = 0; i < 30; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const restaurant =
        restaurants[Math.floor(Math.random() * restaurants.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Get dishes for this restaurant
      const restaurantCategories = categories.filter(
        (c) => c.restaurantId === restaurant.id,
      );
      const restaurantCategoryIds = restaurantCategories.map((c) => c.id);
      const restaurantDishes = allDishes.filter((d) =>
        restaurantCategoryIds.includes(d.categoryId),
      );

      if (restaurantDishes.length === 0) continue;

      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedItems: { item: MenuItem; quantity: number }[] = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const item =
          restaurantDishes[Math.floor(Math.random() * restaurantDishes.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        selectedItems.push({ item, quantity });
        subtotal += Number(item.price) * quantity;
      }

      const deliveryFee = Number(restaurant.deliveryFee);
      const total = subtotal + deliveryFee;

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

      const order = orderRepository.create({
        orderNumber: generateOrderNumber(i),
        status,
        deliveryType: Math.random() > 0.3 ? 'delivery' : 'collection',
        paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
        paymentStatus: status === 'cancelled' ? 'refunded' : 'paid',
        subtotal,
        discount: 0,
        deliveryFee,
        total,
        userId: customer.id,
        restaurantId: restaurant.id,
      });

      if (status === 'delivered') {
        order.deliveredAt = new Date(orderDate.getTime() + 45 * 60000);
      }
      if (status === 'cancelled') {
        order.cancelledAt = new Date(orderDate.getTime() + 5 * 60000);
        order.cancellationReason = 'Customer requested cancellation';
      }

      const savedOrder = await orderRepository.save(order);

      for (const { item, quantity } of selectedItems) {
        const orderItem = orderItemRepository.create({
          menuItemName: item.name,
          quantity,
          unitPrice: Number(item.price),
          totalPrice: Number(item.price) * quantity,
          orderId: savedOrder.id,
          menuItemId: item.id,
        });
        await orderItemRepository.save(orderItem);
      }

      allOrders.push(savedOrder);
    }

    console.log(`   ✓ Created ${allOrders.length} orders`);

    // ===================================
    // Summary
    // ===================================
    console.log('\n🎉 Database reset and seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   • Restaurant Owners: ${owners.length}`);
    console.log(`   • Customers: ${customers.length}`);
    console.log(`   • Restaurants: ${restaurants.length}`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Dishes: ${allDishes.length}`);
    console.log(`   • Orders: ${allOrders.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Test Credentials (password: Password123!):');
    console.log('   Restaurant Owners:');
    owners.forEach((owner) => console.log(`   • ${owner.email}`));
    console.log('   Customers:');
    customers.forEach((customer) => console.log(`   • ${customer.email}`));

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error('Error message:', (error as Error).message);
    console.error('Stack trace:', (error as Error).stack);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

resetAndSeed();
