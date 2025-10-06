-- CreateIndex
CREATE INDEX "customer_order_customer_id_idx" ON "public"."customer_order"("customer_id");

-- CreateIndex
CREATE INDEX "customer_order_order_id_idx" ON "public"."customer_order"("order_id");

-- CreateIndex
CREATE INDEX "customers_document_idx" ON "public"."customers"("document");

-- CreateIndex
CREATE INDEX "items_category_id_idx" ON "public"."items"("category_id");

-- CreateIndex
CREATE INDEX "order_item_order_id_idx" ON "public"."order_item"("order_id");

-- CreateIndex
CREATE INDEX "order_item_item_id_idx" ON "public"."order_item"("item_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "public"."orders"("status");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "public"."orders"("created_at");

-- CreateIndex
CREATE INDEX "payments_order_id_idx" ON "public"."payments"("order_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "public"."payments"("status");
