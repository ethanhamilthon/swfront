CREATE TABLE `guest_word` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`from_language` text,
	`to_language` text,
	`guest_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
