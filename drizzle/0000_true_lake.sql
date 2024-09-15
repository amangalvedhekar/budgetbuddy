CREATE TABLE `Categories` (
	`categoryName` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`transactionType` text,
	FOREIGN KEY (`transactionType`) REFERENCES `TransactionTypes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TransactionLists` (
	`description` text,
	`amount` integer NOT NULL,
	`createdDate` real NOT NULL,
	`modifiedDate` real NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`categoryType` text,
	`transactionType` text,
	FOREIGN KEY (`categoryType`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transactionType`) REFERENCES `TransactionTypes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TransactionTypes` (
	`transactionName` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `TransactionTypes_transactionName_unique` ON `TransactionTypes` (`transactionName`);