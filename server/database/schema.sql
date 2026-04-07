-- ============================================================
-- Interior Furniture E-commerce Database Schema (PostgreSQL)
-- ============================================================
-- This schema is designed for high-customization furniture products
-- with variant-level pricing, stock control, and audit logging.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 1) USER DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  role_id BIGSERIAL PRIMARY KEY,
  role_code VARCHAR(50) NOT NULL UNIQUE,
  role_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  permission_id BIGSERIAL PRIMARY KEY,
  permission_code VARCHAR(100) NOT NULL UNIQUE,
  permission_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  role_id BIGINT NOT NULL REFERENCES roles(role_id),
  account_status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_users_account_status
    CHECK (account_status IN ('active', 'locked', 'deleted'))
);

CREATE TABLE IF NOT EXISTS addresses (
  address_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  address_type VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  ward VARCHAR(100),
  district VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Vietnam',
  postal_code VARCHAR(20),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_addresses_type CHECK (address_type IN ('shipping', 'billing'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_addresses_default_per_type
  ON addresses(user_id, address_type)
  WHERE is_default = TRUE;

-- ============================================================
-- 2) PRODUCT DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  category_id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES categories(category_id) ON DELETE SET NULL,
  category_name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  product_id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES categories(category_id),
  sku_base VARCHAR(80) NOT NULL UNIQUE,
  product_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  base_price NUMERIC(18,2) NOT NULL,
  compare_at_price NUMERIC(18,2),
  style VARCHAR(80),
  short_description VARCHAR(500),
  description TEXT,
  sell_unit VARCHAR(20) NOT NULL DEFAULT 'item',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_products_base_price CHECK (base_price >= 0),
  CONSTRAINT chk_products_compare_price CHECK (
    compare_at_price IS NULL OR compare_at_price >= base_price
  )
);

CREATE TABLE IF NOT EXISTS attributes (
  attribute_id BIGSERIAL PRIMARY KEY,
  attribute_code VARCHAR(50) NOT NULL UNIQUE,
  attribute_name VARCHAR(100) NOT NULL,
  input_type VARCHAR(20) NOT NULL DEFAULT 'select',
  is_variant_axis BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attribute_values (
  attribute_value_id BIGSERIAL PRIMARY KEY,
  attribute_id BIGINT NOT NULL REFERENCES attributes(attribute_id) ON DELETE CASCADE,
  value_code VARCHAR(80) NOT NULL,
  value_label VARCHAR(120) NOT NULL,
  color_hex CHAR(7),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attribute_id, value_code),
  CONSTRAINT chk_attribute_values_color_hex
    CHECK (color_hex IS NULL OR color_hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE IF NOT EXISTS product_variants (
  variant_id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  variant_sku VARCHAR(100) NOT NULL UNIQUE,
  variant_name VARCHAR(200) NOT NULL,
  extra_price NUMERIC(18,2) NOT NULL DEFAULT 0,
  price_override NUMERIC(18,2),
  final_price NUMERIC(18,2) NOT NULL DEFAULT 0,
  length_value NUMERIC(10,2) NOT NULL,
  width_value NUMERIC(10,2) NOT NULL,
  height_value NUMERIC(10,2) NOT NULL,
  dimension_unit VARCHAR(10) NOT NULL DEFAULT 'cm',
  weight_value NUMERIC(10,3) NOT NULL,
  weight_unit VARCHAR(10) NOT NULL DEFAULT 'kg',
  stock_on_hand INT NOT NULL DEFAULT 0,
  stock_reserved INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_variants_price_non_negative CHECK (
    extra_price >= 0
    AND (price_override IS NULL OR price_override >= 0)
    AND final_price >= 0
  ),
  CONSTRAINT chk_variants_dimension_positive CHECK (
    length_value > 0 AND width_value > 0 AND height_value > 0
  ),
  CONSTRAINT chk_variants_weight_positive CHECK (weight_value > 0),
  CONSTRAINT chk_variants_dimension_unit CHECK (dimension_unit IN ('mm', 'cm', 'm')),
  CONSTRAINT chk_variants_weight_unit CHECK (weight_unit IN ('g', 'kg')),
  CONSTRAINT chk_variants_stock_non_negative CHECK (
    stock_on_hand >= 0
    AND stock_reserved >= 0
    AND reorder_level >= 0
    AND stock_reserved <= stock_on_hand
  )
);

CREATE TABLE IF NOT EXISTS product_variant_attributes (
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  attribute_value_id BIGINT NOT NULL REFERENCES attribute_values(attribute_value_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (variant_id, attribute_value_id)
);

CREATE TABLE IF NOT EXISTS product_images (
  image_id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  variant_id BIGINT REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_product_images_sort_order CHECK (sort_order >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_images_primary_per_product
  ON product_images(product_id)
  WHERE is_primary = TRUE AND variant_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_images_primary_per_variant
  ON product_images(variant_id)
  WHERE is_primary = TRUE AND variant_id IS NOT NULL;

-- ============================================================
-- 3) TRANSACTION DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS carts (
  cart_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_carts_status CHECK (status IN ('active', 'converted', 'abandoned'))
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
  quantity INT NOT NULL,
  unit_price_snapshot NUMERIC(18,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, variant_id),
  CONSTRAINT chk_cart_items_qty CHECK (quantity > 0),
  CONSTRAINT chk_cart_items_price CHECK (unit_price_snapshot >= 0)
);

CREATE TABLE IF NOT EXISTS wishlists (
  wishlist_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  wishlist_id BIGINT NOT NULL REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (wishlist_id, variant_id)
);

CREATE TABLE IF NOT EXISTS vouchers (
  voucher_id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  voucher_name VARCHAR(150) NOT NULL,
  discount_type VARCHAR(10) NOT NULL,
  discount_value NUMERIC(18,2) NOT NULL,
  min_order_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  max_discount_amount NUMERIC(18,2),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  usage_limit INT,
  usage_per_user INT,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_vouchers_discount_type CHECK (discount_type IN ('PERCENT', 'FIXED')),
  CONSTRAINT chk_vouchers_value_positive CHECK (discount_value > 0),
  CONSTRAINT chk_vouchers_min_order_non_negative CHECK (min_order_amount >= 0),
  CONSTRAINT chk_vouchers_max_discount_non_negative CHECK (
    max_discount_amount IS NULL OR max_discount_amount >= 0
  ),
  CONSTRAINT chk_vouchers_usage_counts CHECK (
    used_count >= 0
    AND (usage_limit IS NULL OR usage_limit >= 0)
    AND (usage_per_user IS NULL OR usage_per_user >= 0)
  ),
  CONSTRAINT chk_vouchers_time_range CHECK (start_at < end_at)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id BIGSERIAL PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  shipping_address_id BIGINT REFERENCES addresses(address_id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  shipping_address_text VARCHAR(500) NOT NULL,
  subtotal_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(18,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
  voucher_id BIGINT REFERENCES vouchers(voucher_id) ON DELETE SET NULL,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_orders_amount_non_negative CHECK (
    subtotal_amount >= 0
    AND shipping_fee >= 0
    AND discount_amount >= 0
    AND total_amount >= 0
  ),
  CONSTRAINT chk_orders_total_formula CHECK (
    total_amount = subtotal_amount + shipping_fee - discount_amount
  ),
  CONSTRAINT chk_orders_status CHECK (
    status IN ('pending', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded')
  ),
  CONSTRAINT chk_orders_payment_status CHECK (
    payment_status IN ('unpaid', 'paid', 'failed', 'refunded')
  )
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
  product_name_snapshot VARCHAR(255) NOT NULL,
  variant_name_snapshot VARCHAR(255) NOT NULL,
  sku_snapshot VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(18,2) NOT NULL,
  line_total NUMERIC(18,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, variant_id),
  CONSTRAINT chk_order_items_qty CHECK (quantity > 0),
  CONSTRAINT chk_order_items_price_non_negative CHECK (unit_price >= 0),
  CONSTRAINT chk_order_items_line_total CHECK (line_total = quantity * unit_price)
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_method VARCHAR(30) NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  provider_txn_ref VARCHAR(120),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider_txn_ref),
  CONSTRAINT chk_payments_amount CHECK (amount >= 0),
  CONSTRAINT chk_payments_method CHECK (
    payment_method IN ('cod', 'bank_transfer', 'credit_card', 'e_wallet')
  ),
  CONSTRAINT chk_payments_status CHECK (
    status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')
  )
);

-- ============================================================
-- 4) INTERACTION DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  review_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  variant_id BIGINT REFERENCES product_variants(variant_id) ON DELETE SET NULL,
  order_item_id BIGINT REFERENCES order_items(order_item_id) ON DELETE SET NULL,
  rating SMALLINT NOT NULL,
  title VARCHAR(200),
  content TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT chk_reviews_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE TABLE IF NOT EXISTS voucher_usages (
  voucher_usage_id BIGSERIAL PRIMARY KEY,
  voucher_id BIGINT NOT NULL REFERENCES vouchers(voucher_id) ON DELETE RESTRICT,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  order_id BIGINT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
  discount_amount NUMERIC(18,2) NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_voucher_usages_discount_non_negative CHECK (discount_amount >= 0)
);

-- ============================================================
-- 5) AUDIT LOG DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id BIGSERIAL PRIMARY KEY,
  entity_name VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  action VARCHAR(30) NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
  reason VARCHAR(255),
  request_id VARCHAR(100),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6) INDEXES FOR SEARCH / FILTER / PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(account_status);

CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_base_price ON products(base_price);
CREATE INDEX IF NOT EXISTS idx_products_style ON products(style);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(product_name);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (product_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_price
  ON product_variants(product_id, final_price, is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_price ON product_variants(final_price);
CREATE INDEX IF NOT EXISTS idx_product_variants_stock_available
  ON product_variants(product_id, stock_on_hand, stock_reserved);

CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_attr
  ON product_variant_attributes(attribute_value_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_sort
  ON product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_sort
  ON product_images(variant_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_variant_id ON wishlist_items(variant_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_placed_at ON orders(user_id, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_placed_at ON orders(status, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_status ON payments(order_id, status);
CREATE INDEX IF NOT EXISTS idx_vouchers_active_time ON vouchers(is_active, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_voucher_usages_user_id ON voucher_usages(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product_status_created
  ON reviews(product_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_time
  ON audit_logs(entity_name, entity_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_time
  ON audit_logs(changed_by_user_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_time
  ON audit_logs(action, changed_at DESC);

-- ============================================================
-- 7) FUNCTIONS & TRIGGERS (INTEGRITY / STOCK / AUDIT)
-- ============================================================

CREATE OR REPLACE FUNCTION fn_get_actor_user_id()
RETURNS BIGINT AS $$
DECLARE
  v_actor TEXT;
BEGIN
  v_actor := current_setting('app.current_user_id', true);
  IF v_actor IS NULL OR v_actor = '' THEN
    RETURN NULL;
  END IF;
  RETURN v_actor::BIGINT;
EXCEPTION
  WHEN others THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at
CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_addresses_set_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_product_variants_set_updated_at
BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_carts_set_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_cart_items_set_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_wishlists_set_updated_at
BEFORE UPDATE ON wishlists
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_order_items_set_updated_at
BEFORE UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_reviews_set_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_vouchers_set_updated_at
BEFORE UPDATE ON vouchers
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Compute variant final_price:
-- final_price = price_override (if not null) else product.base_price + extra_price
CREATE OR REPLACE FUNCTION fn_compute_variant_final_price()
RETURNS TRIGGER AS $$
DECLARE
  v_base_price NUMERIC(18,2);
BEGIN
  SELECT base_price INTO v_base_price
  FROM products
  WHERE product_id = NEW.product_id;

  IF v_base_price IS NULL THEN
    RAISE EXCEPTION 'Product % does not exist for variant', NEW.product_id;
  END IF;

  NEW.final_price := COALESCE(NEW.price_override, v_base_price + NEW.extra_price);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_variants_compute_final_price
BEFORE INSERT OR UPDATE OF product_id, extra_price, price_override
ON product_variants
FOR EACH ROW EXECUTE FUNCTION fn_compute_variant_final_price();

-- Keep variant prices in sync when product base_price changes
CREATE OR REPLACE FUNCTION fn_sync_variant_price_after_product_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.base_price IS DISTINCT FROM OLD.base_price THEN
    UPDATE product_variants pv
    SET final_price = NEW.base_price + pv.extra_price,
        updated_at = NOW()
    WHERE pv.product_id = NEW.product_id
      AND pv.price_override IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_sync_variant_price
AFTER UPDATE OF base_price ON products
FOR EACH ROW EXECUTE FUNCTION fn_sync_variant_price_after_product_price_change();

-- Reserve stock when order_items are inserted/updated/deleted
CREATE OR REPLACE FUNCTION fn_order_item_reserve_stock()
RETURNS TRIGGER AS $$
DECLARE
  v_available INT;
  v_delta INT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT (stock_on_hand - stock_reserved) INTO v_available
    FROM product_variants
    WHERE variant_id = NEW.variant_id
    FOR UPDATE;

    IF v_available IS NULL THEN
      RAISE EXCEPTION 'Variant % not found', NEW.variant_id;
    END IF;
    IF v_available < NEW.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for variant %, available %, required %',
        NEW.variant_id, v_available, NEW.quantity;
    END IF;

    UPDATE product_variants
    SET stock_reserved = stock_reserved + NEW.quantity,
        updated_at = NOW()
    WHERE variant_id = NEW.variant_id;

    NEW.line_total := NEW.quantity * NEW.unit_price;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.variant_id <> OLD.variant_id THEN
      UPDATE product_variants
      SET stock_reserved = stock_reserved - OLD.quantity,
          updated_at = NOW()
      WHERE variant_id = OLD.variant_id;

      SELECT (stock_on_hand - stock_reserved) INTO v_available
      FROM product_variants
      WHERE variant_id = NEW.variant_id
      FOR UPDATE;

      IF v_available IS NULL THEN
        RAISE EXCEPTION 'Variant % not found', NEW.variant_id;
      END IF;
      IF v_available < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for variant %, available %, required %',
          NEW.variant_id, v_available, NEW.quantity;
      END IF;

      UPDATE product_variants
      SET stock_reserved = stock_reserved + NEW.quantity,
          updated_at = NOW()
      WHERE variant_id = NEW.variant_id;
    ELSE
      v_delta := NEW.quantity - OLD.quantity;
      IF v_delta > 0 THEN
        SELECT (stock_on_hand - stock_reserved) INTO v_available
        FROM product_variants
        WHERE variant_id = NEW.variant_id
        FOR UPDATE;

        IF v_available < v_delta THEN
          RAISE EXCEPTION 'Insufficient stock for variant %, available %, required %',
            NEW.variant_id, v_available, v_delta;
        END IF;

        UPDATE product_variants
        SET stock_reserved = stock_reserved + v_delta,
            updated_at = NOW()
        WHERE variant_id = NEW.variant_id;
      ELSIF v_delta < 0 THEN
        UPDATE product_variants
        SET stock_reserved = stock_reserved + v_delta,
            updated_at = NOW()
        WHERE variant_id = NEW.variant_id;
      END IF;
    END IF;

    NEW.line_total := NEW.quantity * NEW.unit_price;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE product_variants
    SET stock_reserved = stock_reserved - OLD.quantity,
        updated_at = NOW()
    WHERE variant_id = OLD.variant_id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_items_reserve_stock
BEFORE INSERT OR UPDATE OF variant_id, quantity, unit_price OR DELETE
ON order_items
FOR EACH ROW EXECUTE FUNCTION fn_order_item_reserve_stock();

-- Recalculate order subtotal/total from order_items
CREATE OR REPLACE FUNCTION fn_refresh_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_order_id BIGINT;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  UPDATE orders o
  SET subtotal_amount = COALESCE((
        SELECT SUM(oi.line_total)::NUMERIC(18,2)
        FROM order_items oi
        WHERE oi.order_id = v_order_id
      ), 0),
      total_amount = COALESCE((
        SELECT SUM(oi.line_total)::NUMERIC(18,2)
        FROM order_items oi
        WHERE oi.order_id = v_order_id
      ), 0) + o.shipping_fee - o.discount_amount,
      updated_at = NOW()
  WHERE o.order_id = v_order_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_items_refresh_order_totals
AFTER INSERT OR UPDATE OR DELETE
ON order_items
FOR EACH ROW EXECUTE FUNCTION fn_refresh_order_totals();

-- Validate order status transitions
CREATE OR REPLACE FUNCTION fn_validate_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  CASE OLD.status
    WHEN 'pending' THEN
      IF NEW.status NOT IN ('processing', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
      END IF;
    WHEN 'processing' THEN
      IF NEW.status NOT IN ('shipping', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
      END IF;
    WHEN 'shipping' THEN
      IF NEW.status NOT IN ('delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
      END IF;
    WHEN 'delivered' THEN
      IF NEW.status NOT IN ('refunded') THEN
        RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
      END IF;
    WHEN 'cancelled' THEN
      RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
    WHEN 'refunded' THEN
      RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
    ELSE
      RAISE EXCEPTION 'Unknown old status: %', OLD.status;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_validate_status_transition
BEFORE UPDATE OF status ON orders
FOR EACH ROW EXECUTE FUNCTION fn_validate_order_status_transition();

-- Apply stock movement when order status changes:
-- shipping/pending/processing -> delivered: deduct on_hand and reserved
-- shipping/pending/processing -> cancelled/refunded: release reserved
CREATE OR REPLACE FUNCTION fn_apply_stock_on_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'delivered' AND OLD.status IN ('pending', 'processing', 'shipping') THEN
    UPDATE product_variants pv
    SET stock_on_hand = pv.stock_on_hand - oi.quantity,
        stock_reserved = pv.stock_reserved - oi.quantity,
        updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = NEW.order_id
      AND oi.variant_id = pv.variant_id;
  ELSIF NEW.status IN ('cancelled', 'refunded') AND OLD.status IN ('pending', 'processing', 'shipping') THEN
    UPDATE product_variants pv
    SET stock_reserved = pv.stock_reserved - oi.quantity,
        updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = NEW.order_id
      AND oi.variant_id = pv.variant_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_apply_stock_status_change
AFTER UPDATE OF status ON orders
FOR EACH ROW EXECUTE FUNCTION fn_apply_stock_on_order_status_change();

-- Voucher usage validation + used_count maintenance
CREATE OR REPLACE FUNCTION fn_validate_voucher_usage()
RETURNS TRIGGER AS $$
DECLARE
  v_voucher vouchers%ROWTYPE;
  v_user_usage_count INT;
BEGIN
  SELECT * INTO v_voucher FROM vouchers WHERE voucher_id = NEW.voucher_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Voucher % not found', NEW.voucher_id;
  END IF;

  IF NOT v_voucher.is_active THEN
    RAISE EXCEPTION 'Voucher % is inactive', v_voucher.code;
  END IF;

  IF NOW() < v_voucher.start_at OR NOW() > v_voucher.end_at THEN
    RAISE EXCEPTION 'Voucher % is out of effective period', v_voucher.code;
  END IF;

  IF v_voucher.usage_limit IS NOT NULL AND v_voucher.used_count >= v_voucher.usage_limit THEN
    RAISE EXCEPTION 'Voucher % reached usage limit', v_voucher.code;
  END IF;

  IF v_voucher.usage_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO v_user_usage_count
    FROM voucher_usages
    WHERE voucher_id = NEW.voucher_id
      AND user_id = NEW.user_id;

    IF v_user_usage_count >= v_voucher.usage_per_user THEN
      RAISE EXCEPTION 'User reached voucher usage_per_user limit';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_voucher_usages_validate
BEFORE INSERT ON voucher_usages
FOR EACH ROW EXECUTE FUNCTION fn_validate_voucher_usage();

CREATE OR REPLACE FUNCTION fn_sync_voucher_used_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE vouchers
    SET used_count = used_count + 1,
        updated_at = NOW()
    WHERE voucher_id = NEW.voucher_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE vouchers
    SET used_count = GREATEST(used_count - 1, 0),
        updated_at = NOW()
    WHERE voucher_id = OLD.voucher_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_voucher_usages_sync_count
AFTER INSERT OR DELETE ON voucher_usages
FOR EACH ROW EXECUTE FUNCTION fn_sync_voucher_used_count();

-- Audit price changes on products
CREATE OR REPLACE FUNCTION fn_audit_product_price_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.base_price IS DISTINCT FROM OLD.base_price THEN
    INSERT INTO audit_logs (
      entity_name, entity_id, action, field_name,
      old_value, new_value, changed_by_user_id, changed_at
    )
    VALUES (
      'products', NEW.product_id::TEXT, 'PRICE_CHANGE', 'base_price',
      OLD.base_price::TEXT, NEW.base_price::TEXT, fn_get_actor_user_id(), NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_audit_price_change
AFTER UPDATE OF base_price ON products
FOR EACH ROW EXECUTE FUNCTION fn_audit_product_price_changes();

-- Audit price changes on variants
CREATE OR REPLACE FUNCTION fn_audit_variant_price_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.final_price IS DISTINCT FROM OLD.final_price THEN
    INSERT INTO audit_logs (
      entity_name, entity_id, action, field_name,
      old_value, new_value, changed_by_user_id, changed_at
    )
    VALUES (
      'product_variants', NEW.variant_id::TEXT, 'PRICE_CHANGE', 'final_price',
      OLD.final_price::TEXT, NEW.final_price::TEXT, fn_get_actor_user_id(), NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_variants_audit_price_change
AFTER UPDATE OF final_price ON product_variants
FOR EACH ROW EXECUTE FUNCTION fn_audit_variant_price_changes();

-- Audit order status changes
CREATE OR REPLACE FUNCTION fn_audit_order_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO audit_logs (
      entity_name, entity_id, action, field_name,
      old_value, new_value, changed_by_user_id, changed_at
    )
    VALUES (
      'orders', NEW.order_id::TEXT, 'STATUS_CHANGE', 'status',
      OLD.status, NEW.status, fn_get_actor_user_id(), NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_audit_status_change
AFTER UPDATE OF status ON orders
FOR EACH ROW EXECUTE FUNCTION fn_audit_order_status_changes();

COMMIT;
