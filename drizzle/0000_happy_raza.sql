CREATE TABLE `Categories` (
	`categoryName` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`transactionType` text,
	FOREIGN KEY (`transactionType`) REFERENCES `TransactionType`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Categories_categoryName_unique` ON `Categories` (`categoryName`);--> statement-breakpoint
CREATE TABLE `TransactionLists` (
	`description` text,
	`amount` integer NOT NULL,
	`createdDate` real NOT NULL,
	`modifiedDate` real NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`categoryType` text,
	`transactionType` text,
	FOREIGN KEY (`categoryType`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transactionType`) REFERENCES `TransactionType`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TransactionType` (
	`transactionName` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `TransactionType_transactionName_unique` ON `TransactionType` (`transactionName`);