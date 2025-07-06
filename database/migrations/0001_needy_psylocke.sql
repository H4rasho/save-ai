CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
