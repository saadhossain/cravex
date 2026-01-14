# Cravex  - Frontend Implementation Plan (Next.js 15)

## Part 5: Frontend Architecture

---

### 5.1 Project Structure

```
frontend/
├── app/                              # Next.js 15 App Router
│   ├── (public)/                     # Public pages (no auth required)
│   │   ├── page.tsx                  # Home page
│   │   ├── restaurant/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Restaurant detail
│   │   └── layout.tsx
│   │
│   ├── (auth)/                       # Auth pages (redirect if logged in)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (customer)/                   # Customer dashboard (requires auth)
│   │   ├── orders/
│   │   │   ├── page.tsx              # Order history
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Order detail
│   │   ├── addresses/
│   │   │   └── page.tsx              # Saved addresses
│   │   ├── profile/
│   │   │   └── page.tsx              # Profile settings
│   │   ├── checkout/
│   │   │   └── page.tsx              # Checkout page
│   │   └── layout.tsx
│   │
│   ├── (restaurant)/                 # Restaurant owner dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Overview
│   │   ├── menu/
│   │   │   └── page.tsx              # Menu management
│   │   ├── orders/
│   │   │   └── page.tsx              # Incoming orders
│   │   ├── settings/
│   │   │   └── page.tsx              # Restaurant settings
│   │   └── layout.tsx
│   │
│   ├── (admin)/                      # Superadmin panel
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── restaurants/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── coupons/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── layout.tsx                    # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx                 # For mobile drawer
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── carousel.tsx
│   │   └── ...
│   │
│   ├── layout/                       # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── home/                         # Home page sections
│   │   ├── HeroSection.tsx
│   │   ├── DealsCarousel.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── RestaurantGrid.tsx
│   │   ├── PartnerCTA.tsx
│   │   ├── StatsSection.tsx
│   │   └── AppDownload.tsx
│   │
│   ├── restaurant/                   # Restaurant page components
│   │   ├── RestaurantHeader.tsx
│   │   ├── OfferTabs.tsx
│   │   ├── MenuSidebar.tsx
│   │   ├── MenuCategorySection.tsx
│   │   ├── MenuItemCard.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── DeliveryInfo.tsx
│   │   ├── ContactInfo.tsx
│   │   ├── OpeningHours.tsx
│   │   ├── MapSection.tsx
│   │   ├── ReviewsSection.tsx
│   │   └── SimilarRestaurants.tsx
│   │
│   ├── cart/                         # Cart components
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CouponInput.tsx
│   │   ├── DeliveryToggle.tsx
│   │   ├── FreeItemSelector.tsx
│   │   ├── MobileCartDrawer.tsx
│   │   └── MinimumDeliveryWarning.tsx
│   │
│   ├── modals/                       # Modal components
│   │   ├── PostcodeModal.tsx
│   │   ├── MealDealModal.tsx
│   │   ├── CustomizationModal.tsx
│   │   ├── SpecialInstructionsModal.tsx
│   │   └── OrderConfirmationModal.tsx
│   │
│   ├── auth/                         # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── dashboard/                    # Dashboard shared components
│   │   ├── DashboardNav.tsx
│   │   ├── StatsCard.tsx
│   │   └── DataTable.tsx
│   │
│   └── shared/                       # Shared components
│       ├── Logo.tsx
│       ├── Rating.tsx
│       ├── QuantitySelector.tsx
│       ├── PriceDisplay.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
│
├── store/                            # Redux store
│   ├── store.ts
│   ├── provider.tsx
│   ├── api/
│   │   ├── apiSlice.ts               # RTK Query base
│   │   ├── authApi.ts
│   │   ├── restaurantApi.ts
│   │   ├── menuApi.ts
│   │   ├── cartApi.ts
│   │   ├── orderApi.ts
│   │   └── deliveryApi.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       └── uiSlice.ts
│
├── hooks/                            # Custom hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── usePostcode.ts
│   └── useToast.ts
│
├── lib/                              # Utilities
│   ├── api.ts                        # Axios instance
│   ├── utils.ts                      # Helper functions
│   ├── constants.ts
│   └── validations.ts                # Zod schemas
│
├── types/                            # TypeScript types
│   ├── auth.ts
│   ├── restaurant.ts
│   ├── menu.ts
│   ├── cart.ts
│   ├── order.ts
│   └── index.ts
│
└── public/
    ├── images/
    └── icons/
```

---

### 5.2 Component Specifications

#### Header Component
```typescript
// components/layout/Header.tsx

interface HeaderProps {
  // No props - uses context/redux for state
}

/**
 * FEATURES:
 * - Logo (links to home)
 * - Search bar (desktop only, mobile: icon opens search)
 * - Postcode display with change button (opens PostcodeModal)
 * - Navigation links: Home, Deals
 * - Auth buttons: Login/Register OR User menu dropdown
 * - Cart icon with item count badge
 * - Mobile: Hamburger menu icon
 * 
 * RESPONSIVE:
 * - Desktop (>1024px): Full navigation, search bar
 * - Tablet (768-1024px): Condensed nav, search icon
 * - Mobile (<768px): Hamburger menu, cart icon only
 */
```

#### HeroSection Component
```typescript
// components/home/HeroSection.tsx

/**
 * FEATURES:
 * - Large hero image/gradient background
 * - Main headline: "Feast Your Senses, Fast and Fresh"
 * - Subheadline text
 * - Postcode input with search button
 * - "I want to come and collect" link below
 * 
 * UI FROM DESIGN:
 * - Yellow/orange gradient background
 * - Image of person with food on left
 * - Input field: "eg. AA1 1BB" placeholder
 * - Search button with arrow icon
 */
```

#### DealsCarousel Component
```typescript
// components/home/DealsCarousel.tsx

interface DealCardProps {
  id: string;
  title: string;
  discount: string;  // "Up to 40%"
  imageUrl: string;
  restaurantName: string;
}

/**
 * FEATURES:
 * - Horizontal scrolling carousel
 * - "Order.uk exclusive deals" header
 * - Each card shows:
 *   - Deal image
 *   - Restaurant logo/name
 *   - Discount badge (e.g., "-40%")
 *   - Deal title
 * - Navigation arrows (desktop)
 * - Touch swipe (mobile)
 * 
 * DATA: From GET /deals endpoint
 */
```

#### CategoryGrid Component
```typescript
// components/home/CategoryGrid.tsx

interface Category {
  id: string;
  name: string;       // "Burgers", "Pizza"
  iconUrl: string;
  slug: string;
}

/**
 * FEATURES:
 * - "Order.uk Popular Categories" header
 * - Grid of category cards (6 visible on desktop)
 * - Each card has:
 *   - Icon/image
 *   - Category name
 * - Clicking filters restaurants by cuisine type
 * 
 * FROM DESIGN:
 * - Categories: Burgers & Fast food, Salads, Pasta & Casseroles,
 *               Pizza, Breakfast, Soups
 * - Orange/yellow themed icons
 */
```

#### RestaurantGrid Component
```typescript
// components/home/RestaurantGrid.tsx

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  rating: number;
  deliveryTime: string;
  cuisineTypes: string[];
  isOpen: boolean;
}

/**
 * FEATURES:
 * - "Popular Restaurants" header (filterable)
 * - Grid of restaurant cards
 * - Each card shows:
 *   - Restaurant logo/banner
 *   - Name
 *   - Rating (optional)
 * - Cards link to /restaurant/[slug]
 * 
 * FROM DESIGN:
 * - Restaurants shown: McDonald's, Papa John's, KFC, 
 *   Burger King, Texas Chicken, Shawarma
 */
```

#### RestaurantHeader Component
```typescript
// components/restaurant/RestaurantHeader.tsx

interface RestaurantHeaderProps {
  restaurant: RestaurantDetail;
}

/**
 * FEATURES:
 * - Banner image with overlay
 * - Restaurant name (large)
 * - Badges: "Minimum Order £20", "Delivery in xx Minutes"
 * - Rating display with star icon
 * - Action buttons: Add to favorites, Share
 * 
 * FROM DESIGN:
 * - "McDonald's East London" or "Tandoori Pizza London"
 * - Green badges for delivery info
 * - Location pin icon for area
 */
```

#### OfferTabs Component
```typescript
// components/restaurant/OfferTabs.tsx

/**
 * FEATURES:
 * - Tabs: All Offers, Veg Only, Meal Deals (count), Seafood
 * - Active tab highlighted in orange
 * - Filters menu items when tab changes
 * 
 * FROM DESIGN:
 * - "All Offers from [Restaurant]" header
 * - Horizontal tab bar
 */
```

#### MenuSidebar Component
```typescript
// components/restaurant/MenuSidebar.tsx

interface MenuSidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

/**
 * FEATURES:
 * - Sticky sidebar on desktop
 * - Lists all menu categories
 * - Active category highlighted
 * - Clicking scrolls to category section
 * - Search/filter input at top
 * 
 * FROM DESIGN:
 * - "Menu" header with search icon
 * - Categories: Pizzas, Garlic Bread, Starters, 
 *               Appetizers, Classic Pizza, Happy Meal,
 *               Kids Meal, Burgers, Fries, Cold Drinks
 */
```

#### MenuItemCard Component
```typescript
// components/restaurant/MenuItemCard.tsx

interface MenuItemCardProps {
  item: MenuItem;
  onAddClick: (item: MenuItem) => void;
}

/**
 * FEATURES:
 * - Item image (square)
 * - Item name
 * - Description (truncated)
 * - Price display
 * - Tags (Popular, Veg, Spicy)
 * - "Add" button (+ icon)
 * 
 * CLICK BEHAVIOR:
 * - If item has options: Open CustomizationModal
 * - If no options: Add directly to cart
 * 
 * FROM DESIGN:
 * - Two variants: List view and card view
 * - Orange "+" button on right
 * - Price format: "£12.90"
 */
```

#### CartSidebar Component
```typescript
// components/cart/CartSidebar.tsx

/**
 * FEATURES:
 * - Sticky on desktop (right side)
 * - "My Basket" header with icon
 * - List of cart items with:
 *   - Quantity badge
 *   - Item name
 *   - Selected options (smaller text)
 *   - Unit price
 *   - Delete button
 * - Calculations:
 *   - Sub Total
 *   - Discounts (if coupon)
 *   - Delivery Fee
 *   - "Total to pay" (highlighted)
 * - Free item selector (if eligible)
 * - Coupon code input
 * - Delivery/Collection toggle
 * - Checkout button
 * - Minimum delivery warning (if not met)
 * 
 * FROM DESIGN:
 * - Green header bar "My Basket"
 * - Orange quantity badges
 * - Yellow "Total to pay" bar showing amount
 * - Delivery starts at time / Collection starts at time
 * - Warning: "Minimum delivery is £20, You must Spend £10 more"
 */
```

#### MobileCartDrawer Component
```typescript
// components/cart/MobileCartDrawer.tsx

/**
 * FEATURES:
 * - Sheet/drawer from bottom
 * - Same content as CartSidebar
 * - Swipe to close
 * - Triggered by floating cart button
 * 
 * MOBILE ONLY (<768px)
 */
```

#### PostcodeModal Component
```typescript
// components/modals/PostcodeModal.tsx

/**
 * STATES:
 * 1. Initial: Input postcode
 * 2. Validating: Loading state
 * 3. Error: "Sorry, we don't do delivery to your area"
 * 4. Success: "You're All Set! Post Code Submitted"
 *    - Shows "We deliver to your area" message
 *    - Change button to modify
 * 5. Minimum Order Warning: 
 *    - "Order Now - Minimum Delivery is £10"
 *    - "Deliver my order" button
 *    - "I will come & Collect" option
 *    - "Cancel & Go back" link
 * 
 * FROM DESIGN:
 * - Modal with overlay
 * - Delivery person image on left
 * - Form on right side
 * - "I want to come and collect" link
 */
```

#### CustomizationModal Component
```typescript
// components/modals/CustomizationModal.tsx

interface CustomizationModalProps {
  item: MenuItem;
  onComplete: (customizedItem: CartItem) => void;
  onClose: () => void;
}

/**
 * MULTI-STEP FLOW (for deals):
 * Step 1: Select items (e.g., "Please select your first Pizza")
 *         - List of pizza options with images
 *         - Quantity selector per option
 *         - "Next Step" button
 * 
 * Step 2: Customize (e.g., "Customise your chicken Pizza")
 *         - "Please select up to 4 options free!"
 *         - Option groups:
 *           - Vegetable Toppings (checkbox grid)
 *           - Meat Toppings (checkbox grid)
 *           - Seafood Toppings (checkbox grid)
 *         - Counter showing "3/4 Selected"
 *         - "Take me back" and "Next Step" buttons
 * 
 * Step 3: Special Instructions
 *         - Textarea for special requests
 *         - "Add" button to complete
 * 
 * BREADCRUMB:
 * - "Special Offers > Meal Deal 1 > Customise Pizza 1 > Instructions"
 * 
 * SINGLE ITEM FLOW (non-deal):
 * - Direct to customization options if any
 * - Skip to instructions if no options
 * 
 * FROM DESIGN:
 * - Large pizza image at top
 * - Breadcrumb navigation
 * - Orange action buttons
 * - Yellow total price bar at bottom
 */
```

#### MealDealModal Component
```typescript
// components/modals/MealDealModal.tsx

interface MealDealModalProps {
  deal: Deal;
  onComplete: (items: CartItem[]) => void;
  onClose: () => void;
}

/**
 * FEATURES:
 * - Multi-step wizard for meal deals
 * - Step indicator at top
 * - Each step shows relevant selection
 * - "Total to pay" always visible
 * - "Delivery & Tax will be calculated in the next step"
 * 
 * FROM DESIGN:
 * - Pizza images in a list
 * - Each with name and quantity selector (-, number, +)
 * - Hawaiian selected with quantity 2
 */
```

---

### 5.3 Redux Store Structure

```typescript
// store/store.ts

interface RootState {
  // RTK Query API cache
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
  
  // Auth state
  auth: {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  
  // Cart state (client-side for guest, synced with server for auth users)
  cart: {
    restaurantId: string | null;
    restaurantName: string | null;
    items: CartItem[];
    deliveryType: 'delivery' | 'collection';
    couponCode: string | null;
    discount: number;
    subtotal: number;
    deliveryFee: number;
    total: number;
    freeItemSelected: MenuItem | null;
  };
  
  // UI state
  ui: {
    // Modals
    postcodeModalOpen: boolean;
    customizationModal: {
      open: boolean;
      item: MenuItem | null;
      dealId: string | null;
    };
    mealDealModal: {
      open: boolean;
      deal: Deal | null;
    };
    specialInstructionsModal: {
      open: boolean;
      cartItemId: string | null;
    };
    
    // Mobile
    mobileMenuOpen: boolean;
    mobileCartOpen: boolean;
    
    // Global
    postcode: string | null;
    isPostcodeValid: boolean;
    
    // Toast notifications
    toasts: Toast[];
  };
}
```

### 5.4 RTK Query API Slices

```typescript
// store/api/authApi.ts

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutations
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    
    refreshToken: builder.mutation<TokenResponse, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    
    // Queries
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

// store/api/restaurantApi.ts

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query<PaginatedResponse<Restaurant>, RestaurantFilters>({
      query: (filters) => ({
        url: '/restaurants',
        params: filters,
      }),
      providesTags: ['Restaurant'],
    }),
    
    getRestaurantBySlug: builder.query<RestaurantDetail, string>({
      query: (slug) => `/restaurants/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Restaurant', id: slug }],
    }),
    
    getFeaturedRestaurants: builder.query<Restaurant[], void>({
      query: () => '/restaurants/featured',
    }),
    
    searchRestaurants: builder.query<Restaurant[], { q: string; postcode?: string }>({
      query: ({ q, postcode }) => ({
        url: '/restaurants/search',
        params: { q, postcode },
      }),
    }),
  }),
});

// store/api/cartApi.ts

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    
    addToCart: builder.mutation<Cart, AddToCartDto>({
      query: (body) => ({
        url: '/cart/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    updateCartItem: builder.mutation<Cart, { id: string; dto: UpdateCartItemDto }>({
      query: ({ id, dto }) => ({
        url: `/cart/items/${id}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    removeFromCart: builder.mutation<Cart, string>({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    applyCoupon: builder.mutation<Cart, string>({
      query: (code) => ({
        url: '/cart/coupon',
        method: 'POST',
        body: { code },
      }),
      invalidatesTags: ['Cart'],
    }),
    
    removeCoupon: builder.mutation<Cart, void>({
      query: () => ({
        url: '/cart/coupon',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    setDeliveryType: builder.mutation<Cart, 'delivery' | 'collection'>({
      query: (deliveryType) => ({
        url: '/cart/delivery-type',
        method: 'PATCH',
        body: { deliveryType },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

// store/api/orderApi.ts

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),
    
    getOrders: builder.query<PaginatedResponse<Order>, OrderFilters>({
      query: (filters) => ({
        url: '/orders',
        params: filters,
      }),
      providesTags: ['Order'],
    }),
    
    getOrderById: builder.query<OrderDetail, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    cancelOrder: builder.mutation<Order, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});
```

---

### 5.5 Page Implementations

#### Home Page
```typescript
// app/(public)/page.tsx

export default async function HomePage() {
  // Server-side data fetching
  const [restaurants, deals, categories] = await Promise.all([
    fetchRestaurants({ featured: true, limit: 8 }),
    fetchDeals({ limit: 6 }),
    fetchCategories(),
  ]);
  
  return (
    <>
      <HeroSection />
      <DealsCarousel deals={deals} />
      <CategoryGrid categories={categories} />
      <RestaurantGrid 
        restaurants={restaurants} 
        title="Popular Restaurants" 
      />
      <PartnerCTA />
      <StatsSection />
      <AppDownload />
    </>
  );
}
```

#### Restaurant Detail Page
```typescript
// app/(public)/restaurant/[slug]/page.tsx

interface Props {
  params: { slug: string };
}

export default async function RestaurantPage({ params }: Props) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1">
        <RestaurantHeader restaurant={restaurant} />
        <OfferTabs />
        
        <div className="flex">
          {/* Menu Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 sticky top-20">
            <MenuSidebar categories={restaurant.categories} />
          </aside>
          
          {/* Menu Content */}
          <main className="flex-1">
            {restaurant.categories.map((category) => (
              <MenuCategorySection 
                key={category.id}
                category={category}
              />
            ))}
          </main>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DeliveryInfo restaurant={restaurant} />
          <ContactInfo restaurant={restaurant} />
          <OpeningHours hours={restaurant.openingHours} />
        </div>
        
        <MapSection 
          lat={restaurant.latitude} 
          lng={restaurant.longitude} 
        />
        
        <ReviewsSection restaurantId={restaurant.id} />
        <SimilarRestaurants currentId={restaurant.id} />
      </div>
      
      {/* Cart Sidebar - Desktop */}
      <aside className="hidden lg:block w-80 sticky top-20">
        <CartSidebar />
      </aside>
      
      {/* Mobile Cart Button */}
      <MobileCartButton />
    </div>
  );
}
```

---

### 5.6 Dashboard Pages (Restaurant Owner)

#### Menu Management Page
```typescript
// app/(restaurant)/menu/page.tsx

/**
 * FEATURES:
 * - List all categories (accordion or tabs)
 * - Each category expandable to show items
 * - Add Category button
 * - Add Item button per category
 * - Drag & drop reordering
 * - Edit/Delete buttons per item
 * - Toggle availability switch
 * - Bulk actions (select multiple)
 * 
 * ITEM EDIT FORM:
 * - Name, description, price
 * - Image upload
 * - Category selection
 * - Tags (vegetarian, spicy, etc.)
 * - Option groups management (nested)
 */
```

#### Orders Management Page
```typescript
// app/(restaurant)/orders/page.tsx

/**
 * FEATURES:
 * - Tabs: New, Preparing, Ready, Completed, Cancelled
 * - Order cards showing:
 *   - Order number
 *   - Customer name
 *   - Items summary
 *   - Total amount
 *   - Time placed
 *   - Status badge
 * - Click to expand order details
 * - Status update buttons (Confirm, Start Preparing, Mark Ready, etc.)
 * - Print receipt button
 * - Real-time updates (WebSocket future)
 */
```

---

### 5.7 Dashboard Pages (Superadmin)

#### Admin Dashboard
```typescript
// app/(admin)/dashboard/page.tsx

/**
 * STATS CARDS:
 * - Total Orders (today/week/month)
 * - Total Revenue
 * - Active Restaurants
 * - New Customers
 * 
 * CHARTS:
 * - Orders over time (line chart)
 * - Revenue by restaurant (bar chart)
 * - Popular cuisines (pie chart)
 * 
 * RECENT ACTIVITY:
 * - Latest orders
 * - New restaurant registrations
 * - New user signups
 */
```

#### Restaurant Management
```typescript
// app/(admin)/restaurants/page.tsx

/**
 * FEATURES:
 * - Data table with columns:
 *   - Name, Owner, Status, Rating, Orders, Revenue
 * - Filters: Status (active/inactive), Featured
 * - Search by name
 * - Actions: View, Toggle Status, Feature/Unfeature
 * - Bulk actions
 */
```

---

### 5.8 TypeScript Types

```typescript
// types/restaurant.ts

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  rating: number;
  reviewCount: number;
  address: string;
  minimumDelivery: number;
  deliveryFee: number;
  deliveryTimeMinutes: number;
  isOpen: boolean;
  cuisineTypes: string[];
  tags: string[];
}

export interface RestaurantDetail extends Restaurant {
  categories: CategoryWithItems[];
  deals: Deal[];
  openingHours: OpeningHours;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
}

export interface CategoryWithItems {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  spicyLevel: number;
  tags: string[];
  optionGroups: MenuOptionGroup[];
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  selectionType: 'single' | 'multiple';
  minSelections: number;
  maxSelections: number | null;
  freeSelections: number;
  isRequired: boolean;
  options: MenuOption[];
}

export interface MenuOption {
  id: string;
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
  isDefault: boolean;
}

// types/cart.ts

export interface Cart {
  id: string;
  restaurant: Restaurant | null;
  items: CartItem[];
  deliveryType: 'delivery' | 'collection';
  couponCode: string | null;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeItemEligible: boolean;
  minimumDeliveryMet: boolean;
  minimumDeliveryAmount: number;
  amountToMinimum: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions: SelectedOption[];
  specialInstructions: string;
}

export interface SelectedOption {
  groupName: string;
  optionName: string;
  additionalPrice: number;
}

// types/order.ts

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  deliveryType: 'delivery' | 'collection';
  restaurant: Restaurant;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address | null;
  specialInstructions: string;
  estimatedDeliveryTime: Date;
  createdAt: Date;
}

export interface OrderItem {
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions: string[];
  specialInstructions: string;
}
```

---

## Part 6: Verification Plan

### 6.1 Unit Tests

| Component | Tests |
|-----------|-------|
| Auth Slice | Token storage, logout cleanup |
| Cart Slice | Add/remove/update items, calculations |
| PostcodeModal | Validation states, error handling |
| MenuItemCard | Click handlers, option handling |
| CartSidebar | Totals calculation, coupon apply |

### 6.2 Integration Tests (Backend)

```bash
# Run all tests
npm run test:e2e

# Test cases:
# - Auth flow: register -> login -> refresh -> logout
# - Cart flow: add items -> apply coupon -> checkout
# - Restaurant CRUD (owner permissions)
# - Order lifecycle: create -> status updates -> complete
```

### 6.3 E2E Tests (Cypress/Playwright)

1. **Guest browsing**: Home → Restaurant → View Menu
2. **Cart flow**: Add items → View cart → Remove item
3. **Auth flow**: Register → Login → Profile
4. **Order flow**: Login → Add to cart → Checkout → View order
5. **Mobile responsive**: All above at 375px viewport

### 6.4 Manual Checklist

- [ ] Postcode validation with all states
- [ ] Customization modal multi-step flow
- [ ] Cart calculations accuracy
- [ ] Minimum delivery warning display
- [ ] Mobile menu and cart drawer
- [ ] All pages responsive
- [ ] Restaurant owner can manage menu
- [ ] Admin can view all data
