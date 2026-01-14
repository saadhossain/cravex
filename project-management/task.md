# Cravex - Development Task Checklist

## Overview

Complete task breakdown for food ordering & delivery application with JWT auth and role-based access control.

---

## Phase 1: Project Setup ⬜

### 1.1 Backend Setup (NestJS)

- [ ] Initialize NestJS project with TypeScript
- [ ] Install dependencies:
  - [ ] `@nestjs/typeorm`, `typeorm`, `pg` (PostgreSQL)
  - [ ] `@nestjs/cqrs` (CQRS pattern)
  - [ ] `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` (Auth)
  - [ ] `bcrypt` (Password hashing)
  - [ ] `class-validator`, `class-transformer` (DTOs)
  - [ ] `@nestjs/config` (Environment config)
- [ ] Configure Docker Compose for PostgreSQL
- [ ] Set up TypeORM database connection
- [ ] Create `.env` configuration file
- [ ] Configure CORS for frontend

### 1.2 Frontend Setup (Next.js 15)

- [ ] Initialize Next.js 15 project with App Router
- [ ] Install dependencies:
  - [ ] `@reduxjs/toolkit`, `react-redux` (State management)
  - [ ] `axios` (API calls)
  - [ ] `zod` (Validation)
  - [ ] `lucide-react` (Icons)
- [ ] Initialize shadcn/ui:
  - [ ] Run `npx shadcn-ui@latest init`
  - [ ] Add components: Button, Card, Dialog, Input, Sheet, Tabs, Badge
- [ ] Configure Tailwind CSS theme (orange/yellow brand colors)
- [ ] Set up Redux store and provider
- [ ] Create RTK Query base API slice

---

## Phase 2: Authentication System ⬜

### 2.1 Backend Auth Entities

- [ ] Create `User` entity with all fields:
  - id, email, password, firstName, lastName, phone
  - avatarUrl, role, isActive, isEmailVerified
  - refreshToken, createdAt, updatedAt
- [ ] Create database migration for users table

### 2.2 Backend Auth Module

- [ ] Create AuthModule with:
  - [ ] `auth.controller.ts`
  - [ ] `auth.service.ts`
  - [ ] `jwt.strategy.ts`
  - [ ] `local.strategy.ts`
- [ ] Create DTOs:
  - [ ] `RegisterDto` with validation
  - [ ] `LoginDto` with validation
  - [ ] `RefreshTokenDto`
  - [ ] `AuthResponseDto`
  - [ ] `UserResponseDto`
- [ ] Implement CQRS handlers:
  - [ ] `RegisterUserHandler` (hash password, create user, generate tokens)
  - [ ] `LoginUserHandler` (validate credentials, generate tokens)
  - [ ] `RefreshTokenHandler` (validate refresh, issue new tokens)
  - [ ] `LogoutUserHandler` (invalidate refresh token)
  - [ ] `GetCurrentUserHandler`
- [ ] Create Guards:
  - [ ] `JwtAuthGuard`
  - [ ] `RolesGuard`
- [ ] Create Decorators:
  - [ ] `@Roles('admin', 'restaurant', 'customer')`
  - [ ] `@Public()` for unprotected endpoints
  - [ ] `@CurrentUser()` for user injection
- [ ] Implement API endpoints:
  - [ ] POST `/auth/register`
  - [ ] POST `/auth/login`
  - [ ] POST `/auth/refresh`
  - [ ] POST `/auth/logout`
  - [ ] GET `/auth/me`

### 2.3 Frontend Auth

- [ ] Create `authSlice.ts` (Redux slice for auth state)
- [ ] Create `authApi.ts` (RTK Query endpoints)
- [ ] Create components:
  - [ ] `LoginForm.tsx` (email, password, submit)
  - [ ] `RegisterForm.tsx` (name, email, password, role selection)
- [ ] Create pages:
  - [ ] `/login` page
  - [ ] `/register` page
- [ ] Create `(auth)` layout (redirect if logged in)
- [ ] Implement token refresh interceptor in axios
- [ ] Create `ProtectedRoute` middleware

---

## Phase 3: Database Entities ⬜

### 3.1 Restaurant & Menu Entities

- [ ] Create `Restaurant` entity (all 25+ fields)
- [ ] Create `Category` entity
- [ ] Create `MenuItem` entity
- [ ] Create `MenuOptionGroup` entity
- [ ] Create `MenuOption` entity
- [ ] Define all relationships (OneToMany, ManyToOne)
- [ ] Create database migrations

### 3.2 Deals & Offers Entities

- [ ] Create `Deal` entity
- [ ] Create `DealItem` entity
- [ ] Create `DeliveryZone` entity
- [ ] Create `Coupon` entity
- [ ] Create migrations

### 3.3 Order & Cart Entities

- [ ] Create `Cart` entity
- [ ] Create `CartItem` entity
- [ ] Create `CartItemOption` entity
- [ ] Create `Order` entity
- [ ] Create `OrderItem` entity
- [ ] Create `OrderItemOption` entity
- [ ] Create migrations

### 3.4 Supporting Entities

- [ ] Create `Address` entity
- [ ] Create `Review` entity
- [ ] Create migrations
- [ ] Create seed data for testing

---

## Phase 4: Backend Modules (CQRS) ⬜

### 4.1 Restaurant Module

- [ ] Create RestaurantModule structure
- [ ] Create DTOs:
  - [ ] `CreateRestaurantDto`
  - [ ] `UpdateRestaurantDto`
  - [ ] `RestaurantResponseDto`
  - [ ] `RestaurantDetailDto`
  - [ ] `RestaurantListQueryDto`
- [ ] Implement Queries:
  - [ ] `GetRestaurantsQuery` + Handler
  - [ ] `GetRestaurantBySlugQuery` + Handler
  - [ ] `SearchRestaurantsQuery` + Handler
  - [ ] `GetFeaturedRestaurantsQuery` + Handler
- [ ] Implement Commands:
  - [ ] `CreateRestaurantCommand` + Handler
  - [ ] `UpdateRestaurantCommand` + Handler
  - [ ] `UploadRestaurantImageCommand` + Handler
- [ ] Create `RestaurantController` with all endpoints

### 4.2 Menu Module

- [ ] Create MenuModule structure
- [ ] Create DTOs:
  - [ ] `CreateCategoryDto`, `UpdateCategoryDto`
  - [ ] `CreateMenuItemDto`, `UpdateMenuItemDto`
  - [ ] `CreateMenuOptionGroupDto`
  - [ ] `MenuItemResponseDto`, `CategoryWithItemsDto`
- [ ] Implement Queries:
  - [ ] `GetMenuByRestaurantQuery` + Handler
  - [ ] `GetMenuItemDetailQuery` + Handler
  - [ ] `GetCategoriesQuery` + Handler
- [ ] Implement Commands:
  - [ ] `CreateCategoryCommand` + Handler
  - [ ] `UpdateCategoryCommand` + Handler
  - [ ] `DeleteCategoryCommand` + Handler
  - [ ] `ReorderCategoriesCommand` + Handler
  - [ ] `CreateMenuItemCommand` + Handler
  - [ ] `UpdateMenuItemCommand` + Handler
  - [ ] `DeleteMenuItemCommand` + Handler
  - [ ] `ToggleMenuItemAvailabilityCommand` + Handler
  - [ ] `CreateMenuOptionGroupCommand` + Handler
- [ ] Create `MenuController` with all endpoints

### 4.3 Cart Module

- [ ] Create CartModule structure
- [ ] Create DTOs:
  - [ ] `AddToCartDto`, `UpdateCartItemDto`
  - [ ] `CartResponseDto`, `CartItemResponseDto`
  - [ ] `ApplyCouponDto`, `SetDeliveryTypeDto`
- [ ] Implement Queries:
  - [ ] `GetCartQuery` + Handler (with calculations)
- [ ] Implement Commands:
  - [ ] `AddToCartCommand` + Handler
  - [ ] `UpdateCartItemCommand` + Handler
  - [ ] `RemoveFromCartCommand` + Handler
  - [ ] `ClearCartCommand` + Handler
  - [ ] `ApplyCouponCommand` + Handler
  - [ ] `RemoveCouponCommand` + Handler
  - [ ] `SetDeliveryTypeCommand` + Handler
  - [ ] `SelectFreeItemCommand` + Handler
- [ ] Create `CartController` with all endpoints

### 4.4 Order Module

- [ ] Create OrderModule structure
- [ ] Create DTOs:
  - [ ] `CreateOrderDto`
  - [ ] `OrderResponseDto`, `OrderItemResponseDto`
  - [ ] `UpdateOrderStatusDto`
  - [ ] `OrderListQueryDto`
- [ ] Implement Queries:
  - [ ] `GetOrdersQuery` + Handler
  - [ ] `GetOrderByIdQuery` + Handler
  - [ ] `GetRestaurantOrdersQuery` + Handler
- [ ] Implement Commands:
  - [ ] `CreateOrderCommand` + Handler (from cart, generate order number)
  - [ ] `UpdateOrderStatusCommand` + Handler
  - [ ] `CancelOrderCommand` + Handler
- [ ] Create `OrderController` with all endpoints

### 4.5 Delivery Module

- [ ] Create DeliveryModule structure
- [ ] Create DTOs:
  - [ ] `ValidatePostcodeDto`
  - [ ] `PostcodeValidationResponseDto`
- [ ] Implement Queries:
  - [ ] `ValidatePostcodeQuery` + Handler
  - [ ] `GetDeliveryZonesQuery` + Handler
- [ ] Implement Commands:
  - [ ] `AddDeliveryZoneCommand` + Handler
  - [ ] `RemoveDeliveryZoneCommand` + Handler
- [ ] Create `DeliveryController` with endpoints

### 4.6 Review Module

- [ ] Create ReviewModule structure
- [ ] Implement Queries:
  - [ ] `GetRestaurantReviewsQuery` + Handler
- [ ] Implement Commands:
  - [ ] `CreateReviewCommand` + Handler (update restaurant rating)
- [ ] Create endpoints

### 4.7 Admin Module

- [ ] Create AdminModule with superadmin-only endpoints
- [ ] Dashboard stats query
- [ ] User management (list, toggle status)
- [ ] Restaurant management (list, toggle, feature)
- [ ] Site-wide coupon creation
- [ ] Create `AdminController`

---

## Phase 5: Frontend - Layout & Shared ⬜

### 5.1 Layout Components

- [ ] Create `Header.tsx`:
  - [ ] Logo (link to home)
  - [ ] Search bar (desktop)
  - [ ] Postcode display + change button
  - [ ] Auth buttons / User dropdown
  - [ ] Cart icon with count
  - [ ] Mobile hamburger menu
- [ ] Create `Footer.tsx`:
  - [ ] Logo
  - [ ] Subscribe form
  - [ ] Navigation links
  - [ ] Social icons
  - [ ] App download buttons
- [ ] Create `MobileMenu.tsx` (Sheet/drawer)
- [ ] Create root layout with Header/Footer

### 5.2 Shared Components

- [ ] Create `Logo.tsx`
- [ ] Create `Rating.tsx` (stars display)
- [ ] Create `QuantitySelector.tsx` (-, count, +)
- [ ] Create `PriceDisplay.tsx` (formatted £XX.XX)
- [ ] Create `LoadingSpinner.tsx`
- [ ] Create `ErrorBoundary.tsx`

---

## Phase 6: Frontend - Home Page ⬜

### 6.1 Hero Section

- [ ] Create `HeroSection.tsx`:
  - [ ] Background gradient
  - [ ] Hero image (person with food)
  - [ ] Headline: "Feast Your Senses, Fast and Fresh"
  - [ ] Postcode input field
  - [ ] Search/Find button
  - [ ] "I want to come and collect" link

### 6.2 Deals Section

- [ ] Create `DealsCarousel.tsx`:
  - [ ] Section header "Order.uk exclusive deals"
  - [ ] Horizontal scrolling carousel
  - [ ] Deal cards with image, discount badge, title
  - [ ] Navigation arrows
- [ ] Create `DealCard.tsx`

### 6.3 Categories Section

- [ ] Create `CategoryGrid.tsx`:
  - [ ] Section header "Order.uk Popular Categories"
  - [ ] Grid of category cards
- [ ] Create `CategoryCard.tsx`:
  - [ ] Category icon/image
  - [ ] Category name

### 6.4 Restaurants Section

- [ ] Create `RestaurantGrid.tsx`:
  - [ ] Section header "Popular Restaurants"
  - [ ] Category filter tabs
  - [ ] Grid of restaurant cards
- [ ] Create `RestaurantCard.tsx`:
  - [ ] Restaurant logo
  - [ ] Link to restaurant page

### 6.5 Partner & Stats Sections

- [ ] Create `PartnerCTA.tsx`:
  - [ ] Two cards: "Partner with us" and "Ride with us"
  - [ ] Images and CTAs
- [ ] Create `StatsSection.tsx`:
  - [ ] Stats: 546+ Registered Riders, 789,900+ Orders Delivered, etc.
  - [ ] Counter animations
- [ ] Create `AppDownload.tsx`:
  - [ ] App Store / Play Store buttons

### 6.6 Assemble Home Page

- [ ] Create `app/(public)/page.tsx`
- [ ] Import and arrange all sections
- [ ] Add RTK Query data fetching

---

## Phase 7: Frontend - Restaurant Page ⬜

### 7.1 Restaurant Header

- [ ] Create `RestaurantHeader.tsx`:
  - [ ] Banner image
  - [ ] Restaurant name
  - [ ] Rating stars and count
  - [ ] Info badges (min order, delivery time)
  - [ ] Location text

### 7.2 Menu Navigation

- [ ] Create `OfferTabs.tsx`:
  - [ ] Tabs: All Offers, Veg Only, Meal Deals, etc.
  - [ ] Active tab styling
- [ ] Create `MenuSidebar.tsx`:
  - [ ] Category list with scroll-to-section
  - [ ] Search/filter input
  - [ ] Sticky positioning

### 7.3 Menu Display

- [ ] Create `MenuCategorySection.tsx`:
  - [ ] Category header
  - [ ] Grid of menu items
- [ ] Create `MenuItemCard.tsx`:
  - [ ] Item image
  - [ ] Name and description
  - [ ] Price
  - [ ] Tags (Popular, Veg, Spicy)
  - [ ] Add button (opens modal if options)

### 7.4 Cart Sidebar

- [ ] Create `CartSidebar.tsx`:
  - [ ] "My Basket" header
  - [ ] Cart items list
  - [ ] Subtotal, discount, delivery fee
  - [ ] Total to pay (highlighted)
  - [ ] Free item selector
  - [ ] Coupon input
  - [ ] Delivery/Collection toggle
  - [ ] Checkout button
  - [ ] Minimum delivery warning
- [ ] Create `CartItem.tsx`:
  - [ ] Quantity badge
  - [ ] Item name + selected options
  - [ ] Price
  - [ ] Delete button

### 7.5 Restaurant Info Sections

- [ ] Create `DeliveryInfo.tsx` (delivery area, times)
- [ ] Create `ContactInfo.tsx` (phone, email, address)
- [ ] Create `OpeningHours.tsx` (table of hours)
- [ ] Create `MapSection.tsx` (embedded map)
- [ ] Create `ReviewsSection.tsx`:
  - [ ] Overall rating display
  - [ ] Review list
- [ ] Create `SimilarRestaurants.tsx` (carousel)

### 7.6 Assemble Restaurant Page

- [ ] Create `app/(public)/restaurant/[slug]/page.tsx`
- [ ] Layout: main content + cart sidebar
- [ ] Mobile cart button
- [ ] RTK Query data fetching

---

## Phase 8: Frontend - Modals ⬜

### 8.1 Postcode Modal

- [ ] Create `PostcodeModal.tsx`:
  - [ ] State 1: Input form
  - [ ] State 2: Loading
  - [ ] State 3: Error ("we don't deliver")
  - [ ] State 4: Success ("You're all set")
  - [ ] State 5: Minimum order warning
  - [ ] "I want to come and collect" link
- [ ] Add to uiSlice state management
- [ ] Trigger from Header and Hero

### 8.2 Customization Modal

- [ ] Create `CustomizationModal.tsx`:
  - [ ] Breadcrumb navigation
  - [ ] Option groups display:
    - [ ] Vegetable Toppings section
    - [ ] Meat Toppings section
    - [ ] Seafood Toppings section
  - [ ] Selection counter (3/4 Selected)
  - [ ] Total price bar
  - [ ] Back and Next buttons
- [ ] Create `OptionGroupSection.tsx`:
  - [ ] Group name header (with icon)
  - [ ] Checkbox grid for options
- [ ] Handle free selections logic

### 8.3 Meal Deal Modal

- [ ] Create `MealDealModal.tsx`:
  - [ ] Multi-step wizard
  - [ ] Step 1: Select items with quantities
  - [ ] Step 2+: Customize selected items
  - [ ] Final step: Special instructions
  - [ ] Progress indicator
- [ ] Create `DealItemSelector.tsx`:
  - [ ] Item row with image, name
  - [ ] Quantity selector

### 8.4 Special Instructions Modal

- [ ] Create `SpecialInstructionsModal.tsx`:
  - [ ] Textarea for instructions
  - [ ] Character limit indicator
  - [ ] Add/Save button

---

## Phase 9: Frontend - Mobile / Cart ⬜

### 9.1 Mobile Cart

- [ ] Create `MobileCartDrawer.tsx` (Sheet from bottom)
- [ ] Create `MobileCartButton.tsx` (floating button with count)
- [ ] Reuse CartItem and CartSummary components

### 9.2 Mobile Responsive

- [ ] Test and adjust Header for mobile
- [ ] Test and adjust Home page sections
- [ ] Test and adjust Restaurant page layout
- [ ] Test menu sidebar as mobile sheet
- [ ] Test all modals on mobile

---

## Phase 10: Frontend - Dashboards ⬜

### 10.1 Customer Dashboard

- [ ] Create `(customer)` layout with sidebar nav
- [ ] Create `/orders` page (order history table)
- [ ] Create `/orders/[id]` page (order detail)
- [ ] Create `/addresses` page (CRUD addresses)
- [ ] Create `/profile` page (edit profile)
- [ ] Create `/checkout` page

### 10.2 Restaurant Owner Dashboard

- [ ] Create `(restaurant)` layout with dashboard nav
- [ ] Create `/dashboard` page (overview stats)
- [ ] Create `/menu` page:
  - [ ] Category management (CRUD)
  - [ ] Menu item management (CRUD)
  - [ ] Option group management
  - [ ] Drag & drop reorder
- [ ] Create `/orders` page:
  - [ ] Tabs by status
  - [ ] Order cards with status update buttons
- [ ] Create `/settings` page:
  - [ ] Restaurant info edit
  - [ ] Opening hours
  - [ ] Delivery zones management

### 10.3 Admin Dashboard

- [ ] Create `(admin)` layout
- [ ] Create `/dashboard` page (stats, charts)
- [ ] Create `/users` page (data table, toggle)
- [ ] Create `/restaurants` page (manage, feature)
- [ ] Create `/orders` page (all orders view)
- [ ] Create `/coupons` page (create site-wide)

---

## Phase 11: Integration & Testing ⬜

### 11.1 API Integration

- [ ] Connect all frontend pages to backend APIs
- [ ] Test auth flow end-to-end
- [ ] Test cart operations end-to-end
- [ ] Test order placement end-to-end

### 11.2 Testing

- [ ] Backend unit tests for handlers
- [ ] Backend E2E tests for API endpoints
- [ ] Frontend component tests
- [ ] E2E tests (Cypress/Playwright):
  - [ ] Guest browsing flow
  - [ ] Auth flow
  - [ ] Order flow
  - [ ] Mobile tests

### 11.3 Final Polish

- [ ] Loading states everywhere
- [ ] Error handling and user feedback
- [ ] Animations and transitions
- [ ] Performance optimization
- [ ] Accessibility review

---

## Quick Reference

| Phase     | Description          | Est. Tasks |
| --------- | -------------------- | ---------- |
| 1         | Project Setup        | 20         |
| 2         | Authentication       | 30         |
| 3         | Database Entities    | 25         |
| 4         | Backend CQRS Modules | 50         |
| 5         | Frontend Layout      | 15         |
| 6         | Home Page            | 20         |
| 7         | Restaurant Page      | 25         |
| 8         | Modals               | 20         |
| 9         | Mobile/Cart          | 10         |
| 10        | Dashboards           | 25         |
| 11        | Integration/Testing  | 20         |
| **Total** |                      | **~260**   |
