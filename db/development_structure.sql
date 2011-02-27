CREATE TABLE "copies" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "category" integer, "content" text, "created_at" datetime, "updated_at" datetime);
CREATE TABLE "profiles" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255), "layout" varchar(255), "keyboard" varchar(255), "created_at" datetime, "updated_at" datetime);
CREATE TABLE "records" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer, "profile_id" integer, "words" integer, "duration" integer, "wpm" integer, "cpm" integer, "created_at" datetime, "updated_at" datetime);
CREATE TABLE "schema_migrations" ("version" varchar(255) NOT NULL);
CREATE TABLE "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(255) DEFAULT '' NOT NULL, "encrypted_password" varchar(128) DEFAULT '' NOT NULL, "reset_password_token" varchar(255), "remember_created_at" datetime, "sign_in_count" integer DEFAULT 0, "current_sign_in_at" datetime, "last_sign_in_at" datetime, "current_sign_in_ip" varchar(255), "last_sign_in_ip" varchar(255), "default_profile_id" integer DEFAULT 1, "created_at" datetime, "updated_at" datetime);
CREATE UNIQUE INDEX "index_users_on_email" ON "users" ("email");
CREATE UNIQUE INDEX "index_users_on_reset_password_token" ON "users" ("reset_password_token");
CREATE UNIQUE INDEX "unique_schema_migrations" ON "schema_migrations" ("version");
INSERT INTO schema_migrations (version) VALUES ('20110226161030');

INSERT INTO schema_migrations (version) VALUES ('20110226162914');

INSERT INTO schema_migrations (version) VALUES ('20110226163145');

INSERT INTO schema_migrations (version) VALUES ('20110227033401');