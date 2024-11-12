CREATE TABLE `word_descs` (
	`id` text PRIMARY KEY NOT NULL,
	`word_title` text,
	`to_language` text,
	`pos` text,
	`level` text,
	`pronounce` text,
	`article` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
