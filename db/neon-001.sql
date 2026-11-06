CREATE TABLE "ads" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"category" text NOT NULL,
	"kind" text NOT NULL,
	"nation" text NOT NULL,
	"area" text NOT NULL,
	"title" text NOT NULL,
	"rent" integer NOT NULL,
	"body" text NOT NULL,
	"bills" text NOT NULL,
	"proof" text NOT NULL,
	"status" text NOT NULL,
	"created" integer NOT NULL,
	"expires" integer NOT NULL
);

CREATE UNIQUE INDEX "one_free_ad" ON "ads" ("owner","category") WHERE status in ('pending','live');
CREATE INDEX "live_expiry" ON "ads" ("status","expires");
CREATE TABLE "enquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"ad" text NOT NULL,
	"sender" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"created" integer NOT NULL,
	FOREIGN KEY ("ad") REFERENCES "ads"("id") ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX "one_enquiry_per_ad" ON "enquiries" ("ad","sender");
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"product" text NOT NULL,
	"amount" integer NOT NULL,
	"created" integer NOT NULL
);

CREATE TABLE "passes" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"owner" text NOT NULL,
	"product" text NOT NULL,
	"expires" integer NOT NULL
);

CREATE UNIQUE INDEX "passes_order_id_unique" ON "passes" ("order_id");ALTER TABLE "enquiries" ADD "contact" text DEFAULT '' NOT NULL;