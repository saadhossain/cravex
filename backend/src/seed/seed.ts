import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { Category } from '../domain/entities/category.entity';
import { MenuItem } from '../domain/entities/menu-item.entity';
import { OrderItem } from '../domain/entities/order-item.entity';
import { Order, OrderStatus } from '../domain/entities/order.entity';
import { Restaurant } from '../domain/entities/restaurant.entity';
import { User } from '../domain/entities/user.entity';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const categoryRepository = AppDataSource.getRepository(Category);
    const menuItemRepository = AppDataSource.getRepository(MenuItem);
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);

    // Check if we already have seeded data
    const existingRestaurants = await restaurantRepository.count();
    if (existingRestaurants > 0) {
      console.log('⚠️ Database already has data. Skipping seed...');
      console.log('If you want to re-seed, please clear the database first.');
      await AppDataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // ===================================
    // 1. Create Users
    // ===================================
    console.log('👥 Creating users...');

    // Create restaurant owners
    const owner1 = userRepository.create({
      email: 'owner1@pizzaparadise.com',
      password: hashedPassword,
      firstName: 'Mario',
      lastName: 'Rossi',
      phone: '+44 20 7123 4567',
      role: 'restaurant',
      isActive: true,
      isEmailVerified: true,
    });

    const owner2 = userRepository.create({
      email: 'owner2@burgerhouse.com',
      password: hashedPassword,
      firstName: 'James',
      lastName: 'Wilson',
      phone: '+44 20 7234 5678',
      role: 'restaurant',
      isActive: true,
      isEmailVerified: true,
    });

    const owner3 = userRepository.create({
      email: 'owner3@sushizen.com',
      password: hashedPassword,
      firstName: 'Yuki',
      lastName: 'Tanaka',
      phone: '+44 20 7345 6789',
      role: 'restaurant',
      isActive: true,
      isEmailVerified: true,
    });

    // Create customer users
    const customer1 = userRepository.create({
      email: 'john.doe@email.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+44 7911 123456',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
    });

    const customer2 = userRepository.create({
      email: 'jane.smith@email.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+44 7922 234567',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
    });

    const customer3 = userRepository.create({
      email: 'bob.johnson@email.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Johnson',
      phone: '+44 7933 345678',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
    });

    const customer4 = userRepository.create({
      email: 'alice.brown@email.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Brown',
      phone: '+44 7944 456789',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
    });

    const customer5 = userRepository.create({
      email: 'charlie.davis@email.com',
      password: hashedPassword,
      firstName: 'Charlie',
      lastName: 'Davis',
      phone: '+44 7955 567890',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
    });

    await userRepository.save([
      owner1,
      owner2,
      owner3,
      customer1,
      customer2,
      customer3,
      customer4,
      customer5,
    ]);
    console.log('✅ Users created');

    // ===================================
    // 2. Create Restaurants
    // ===================================
    console.log('🍕 Creating restaurants...');

    const defaultOpeningHours = {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '10:00', close: '23:00', isClosed: false },
      saturday: { open: '11:00', close: '23:00', isClosed: false },
      sunday: { open: '11:00', close: '21:00', isClosed: false },
    };

    const restaurant1 = restaurantRepository.create({
      name: 'Pizza Paradise',
      slug: 'pizza-paradise',
      description:
        'Authentic Italian pizza made with fresh ingredients and traditional recipes. Our wood-fired oven gives each pizza that perfect crispy crust.',
      logoUrl:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800',
      rating: 4.5,
      reviewCount: 127,
      address: '123 High Street, London, EC1A 1BB',
      latitude: 51.5074,
      longitude: -0.1278,
      phone: '+44 20 7123 4567',
      email: 'info@pizzaparadise.com',
      openingHours: defaultOpeningHours,
      minimumDelivery: 12.0,
      deliveryFee: 2.5,
      deliveryTimeMinutes: 30,
      isActive: true,
      isFeatured: true,
      cuisineTypes: ['Italian', 'Pizza'],
      tags: ['Family Friendly', 'Vegetarian Options', 'Wood Fired'],
      ownerId: owner1.id,
    });

    const restaurant2 = restaurantRepository.create({
      name: 'Burger House',
      slug: 'burger-house',
      description:
        'Gourmet burgers made with 100% grass-fed beef, fresh toppings, and our signature sauces. The best burgers in town!',
      logoUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
      rating: 4.3,
      reviewCount: 89,
      address: '456 Oxford Street, London, W1D 1AN',
      latitude: 51.5155,
      longitude: -0.1419,
      phone: '+44 20 7234 5678',
      email: 'info@burgerhouse.com',
      openingHours: defaultOpeningHours,
      minimumDelivery: 10.0,
      deliveryFee: 3.0,
      deliveryTimeMinutes: 25,
      isActive: true,
      isFeatured: true,
      cuisineTypes: ['American', 'Burgers', 'Fast Food'],
      tags: ['Halal', 'Takeaway', 'Late Night'],
      ownerId: owner2.id,
    });

    const restaurant3 = restaurantRepository.create({
      name: 'Sushi Zen',
      slug: 'sushi-zen',
      description:
        'Experience the art of Japanese cuisine with our fresh sushi, sashimi, and traditional dishes prepared by master chefs.',
      logoUrl:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
      bannerUrl:
        'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800',
      rating: 4.7,
      reviewCount: 156,
      address: '789 Covent Garden, London, WC2E 8HD',
      latitude: 51.5127,
      longitude: -0.1232,
      phone: '+44 20 7345 6789',
      email: 'info@sushizen.com',
      openingHours: defaultOpeningHours,
      minimumDelivery: 15.0,
      deliveryFee: 3.5,
      deliveryTimeMinutes: 35,
      isActive: true,
      isFeatured: false,
      cuisineTypes: ['Japanese', 'Sushi', 'Asian'],
      tags: ['Premium', 'Healthy', 'Fresh Fish'],
      ownerId: owner3.id,
    });

    await restaurantRepository.save([restaurant1, restaurant2, restaurant3]);
    console.log('✅ Restaurants created');

    // ===================================
    // 3. Create Categories and Menu Items
    // ===================================
    console.log('🍽️ Creating categories and menu items...');

    // Pizza Paradise Categories and Items
    const pizzaCategory = categoryRepository.create({
      name: 'Pizzas',
      slug: 'pizza-paradise-pizzas',
      description: 'Our signature wood-fired pizzas',
      displayOrder: 1,
      isActive: true,
      restaurantId: restaurant1.id,
    });

    const pastaCategory = categoryRepository.create({
      name: 'Pasta',
      slug: 'pizza-paradise-pasta',
      description: 'Fresh homemade pasta dishes',
      displayOrder: 2,
      isActive: true,
      restaurantId: restaurant1.id,
    });

    const dessertCategoryPizza = categoryRepository.create({
      name: 'Desserts',
      slug: 'pizza-paradise-desserts',
      description: 'Sweet Italian desserts',
      displayOrder: 3,
      isActive: true,
      restaurantId: restaurant1.id,
    });

    await categoryRepository.save([
      pizzaCategory,
      pastaCategory,
      dessertCategoryPizza,
    ]);

    // Pizza Paradise Menu Items
    const pizzaItems = [
      {
        name: 'Margherita Pizza',
        description:
          'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        imageUrl:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        categoryId: pizzaCategory.id,
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Loaded with premium pepperoni and melted cheese',
        price: 14.99,
        imageUrl:
          'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: pizzaCategory.id,
      },
      {
        name: 'Quattro Formaggi',
        description:
          'Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan',
        price: 15.99,
        imageUrl:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        isAvailable: true,
        isVegetarian: true,
        categoryId: pizzaCategory.id,
      },
      {
        name: 'Diavola',
        description: 'Spicy pizza with nduja, calabrian chili, and pepperoni',
        price: 15.99,
        imageUrl:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        isAvailable: true,
        isSpicy: true,
        spicyLevel: 3,
        categoryId: pizzaCategory.id,
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with pancetta, egg, and parmesan',
        price: 11.99,
        imageUrl:
          'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: pastaCategory.id,
      },
      {
        name: 'Penne Arrabiata',
        description: 'Spicy tomato pasta with garlic and chili',
        price: 10.99,
        imageUrl:
          'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
        isSpicy: true,
        spicyLevel: 2,
        categoryId: pastaCategory.id,
      },
      {
        name: 'Tiramisu',
        description:
          'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
        price: 6.99,
        imageUrl:
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: dessertCategoryPizza.id,
      },
    ];

    const savedPizzaItems = await menuItemRepository.save(
      pizzaItems.map((item) => menuItemRepository.create(item)),
    );

    // Burger House Categories and Items
    const burgerCategory = categoryRepository.create({
      name: 'Burgers',
      slug: 'burger-house-burgers',
      description: 'Signature gourmet burgers',
      displayOrder: 1,
      isActive: true,
      restaurantId: restaurant2.id,
    });

    const sidesCategory = categoryRepository.create({
      name: 'Sides',
      slug: 'burger-house-sides',
      description: 'Perfect accompaniments',
      displayOrder: 2,
      isActive: true,
      restaurantId: restaurant2.id,
    });

    const drinksCategory = categoryRepository.create({
      name: 'Drinks',
      slug: 'burger-house-drinks',
      description: 'Refreshing beverages',
      displayOrder: 3,
      isActive: true,
      restaurantId: restaurant2.id,
    });

    await categoryRepository.save([
      burgerCategory,
      sidesCategory,
      drinksCategory,
    ]);

    const burgerItems = [
      {
        name: 'Classic Cheeseburger',
        description:
          'Beef patty, American cheese, lettuce, tomato, pickles, our secret sauce',
        price: 11.99,
        imageUrl:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: burgerCategory.id,
      },
      {
        name: 'Double Stack Burger',
        description:
          'Two beef patties, double cheese, bacon, caramelized onions',
        price: 15.99,
        imageUrl:
          'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: burgerCategory.id,
      },
      {
        name: 'Spicy Jalapeño Burger',
        description: 'Beef patty, pepper jack cheese, jalapeños, chipotle mayo',
        price: 13.99,
        imageUrl:
          'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
        isAvailable: true,
        isSpicy: true,
        spicyLevel: 2,
        categoryId: burgerCategory.id,
      },
      {
        name: 'Crispy Fries',
        description: 'Golden crispy seasoned fries',
        price: 4.99,
        imageUrl:
          'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        isVegan: true,
        categoryId: sidesCategory.id,
      },
      {
        name: 'Loaded Fries',
        description: 'Fries topped with cheese, bacon bits, and sour cream',
        price: 7.99,
        imageUrl:
          'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400',
        isAvailable: true,
        categoryId: sidesCategory.id,
      },
      {
        name: 'Onion Rings',
        description: 'Beer-battered crispy onion rings',
        price: 5.99,
        imageUrl:
          'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
        isAvailable: true,
        isVegetarian: true,
        categoryId: sidesCategory.id,
      },
      {
        name: 'Milkshake',
        description:
          'Thick and creamy milkshake (Vanilla, Chocolate, or Strawberry)',
        price: 4.99,
        imageUrl:
          'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        isAvailable: true,
        isVegetarian: true,
        categoryId: drinksCategory.id,
      },
    ];

    const savedBurgerItems = await menuItemRepository.save(
      burgerItems.map((item) => menuItemRepository.create(item)),
    );

    // Sushi Zen Categories and Items
    const sushiCategory = categoryRepository.create({
      name: 'Sushi Rolls',
      slug: 'sushi-zen-rolls',
      description: 'Fresh handmade sushi rolls',
      displayOrder: 1,
      isActive: true,
      restaurantId: restaurant3.id,
    });

    const sashimiCategory = categoryRepository.create({
      name: 'Sashimi',
      slug: 'sushi-zen-sashimi',
      description: 'Premium sliced raw fish',
      displayOrder: 2,
      isActive: true,
      restaurantId: restaurant3.id,
    });

    const ramenCategory = categoryRepository.create({
      name: 'Ramen',
      slug: 'sushi-zen-ramen',
      description: 'Traditional Japanese noodle soups',
      displayOrder: 3,
      isActive: true,
      restaurantId: restaurant3.id,
    });

    await categoryRepository.save([
      sushiCategory,
      sashimiCategory,
      ramenCategory,
    ]);

    const sushiItems = [
      {
        name: 'California Roll',
        description: 'Crab, avocado, cucumber, tobiko',
        price: 8.99,
        imageUrl:
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: sushiCategory.id,
      },
      {
        name: 'Dragon Roll',
        description: 'Eel, crab, avocado, cucumber, unagi sauce',
        price: 14.99,
        imageUrl:
          'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: sushiCategory.id,
      },
      {
        name: 'Spicy Tuna Roll',
        description: 'Fresh tuna, spicy mayo, sesame seeds',
        price: 10.99,
        imageUrl:
          'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400',
        isAvailable: true,
        isSpicy: true,
        spicyLevel: 2,
        categoryId: sushiCategory.id,
      },
      {
        name: 'Salmon Sashimi',
        description: '6 pieces of premium fresh salmon',
        price: 12.99,
        imageUrl:
          'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: sashimiCategory.id,
      },
      {
        name: 'Mixed Sashimi Platter',
        description: 'Chef selection of 12 pieces of premium fish',
        price: 24.99,
        imageUrl:
          'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400',
        isAvailable: true,
        categoryId: sashimiCategory.id,
      },
      {
        name: 'Tonkotsu Ramen',
        description: 'Rich pork bone broth, chashu pork, soft egg, noodles',
        price: 13.99,
        imageUrl:
          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        isAvailable: true,
        isPopular: true,
        categoryId: ramenCategory.id,
      },
      {
        name: 'Spicy Miso Ramen',
        description: 'Spicy miso broth, ground pork, corn, noodles',
        price: 12.99,
        imageUrl:
          'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
        isAvailable: true,
        isSpicy: true,
        spicyLevel: 2,
        categoryId: ramenCategory.id,
      },
    ];

    const savedSushiItems = await menuItemRepository.save(
      sushiItems.map((item) => menuItemRepository.create(item)),
    );

    console.log('✅ Categories and menu items created');

    // ===================================
    // 4. Create Orders
    // ===================================
    console.log('📦 Creating orders...');

    const customers = [customer1, customer2, customer3, customer4, customer5];
    const allMenuItems = [
      ...savedPizzaItems,
      ...savedBurgerItems,
      ...savedSushiItems,
    ];
    const restaurants = [restaurant1, restaurant2, restaurant3];
    const statuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    const orders: Order[] = [];

    // Generate order number function
    const generateOrderNumber = (index: number): string => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `ORD-${year}${month}-${(1000 + index).toString()}`;
    };

    // Create orders for each restaurant
    for (let i = 0; i < 25; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const restaurant =
        restaurants[Math.floor(Math.random() * restaurants.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Get menu items for this restaurant
      let restaurantItems: MenuItem[];
      if (restaurant.id === restaurant1.id) {
        restaurantItems = savedPizzaItems;
      } else if (restaurant.id === restaurant2.id) {
        restaurantItems = savedBurgerItems;
      } else {
        restaurantItems = savedSushiItems;
      }

      // Random number of items in order (1-4)
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedItems: { item: MenuItem; quantity: number }[] = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const item =
          restaurantItems[Math.floor(Math.random() * restaurantItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        selectedItems.push({ item, quantity });
        subtotal += Number(item.price) * quantity;
      }

      const deliveryFee = Number(restaurant.deliveryFee);
      const total = subtotal + deliveryFee;

      // Randomize the order date within last 30 days
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
      orderDate.setHours(
        Math.floor(Math.random() * 12) + 10,
        Math.floor(Math.random() * 60),
        0,
        0,
      );

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
        createdAt: orderDate,
        updatedAt: orderDate,
      });

      if (status === 'delivered') {
        order.deliveredAt = new Date(orderDate.getTime() + 45 * 60000);
      }
      if (status === 'cancelled') {
        order.cancelledAt = new Date(orderDate.getTime() + 5 * 60000);
        order.cancellationReason = 'Customer requested cancellation';
      }

      await orderRepository.save(order);

      // Create order items
      for (const { item, quantity } of selectedItems) {
        const orderItem = orderItemRepository.create({
          menuItemName: item.name,
          quantity,
          unitPrice: Number(item.price),
          totalPrice: Number(item.price) * quantity,
          orderId: order.id,
          menuItemId: item.id,
        });
        await orderItemRepository.save(orderItem);
      }

      orders.push(order);
    }

    console.log('✅ Orders created');

    // ===================================
    // Summary
    // ===================================
    console.log('\n🎉 Seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   • Restaurant Owners: 3`);
    console.log(`   • Customers: 5`);
    console.log(`   • Restaurants: 3`);
    console.log(
      `   • Menu Items: ${savedPizzaItems.length + savedBurgerItems.length + savedSushiItems.length}`,
    );
    console.log(`   • Orders: ${orders.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Test Credentials (password: Password123!):');
    console.log('   Restaurant Owners:');
    console.log('   • owner1@pizzaparadise.com');
    console.log('   • owner2@burgerhouse.com');
    console.log('   • owner3@sushizen.com');
    console.log('   Customers:');
    console.log('   • john.doe@email.com');
    console.log('   • jane.smith@email.com');
    console.log('   • bob.johnson@email.com');
    console.log('   • alice.brown@email.com');
    console.log('   • charlie.davis@email.com');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
