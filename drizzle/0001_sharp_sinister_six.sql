CREATE TABLE `UserLists` (
	`userId` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_TransactionLists` (
	`description` text,
	`amount` integer NOT NULL,
	`createdDate` text DEFAULT (CURRENT_TIMESTAMP),
	`modifiedDate` text DEFAULT (CURRENT_TIMESTAMP),
	`id` text PRIMARY KEY NOT NULL,
	`addedBy` text,
	`categoryType` text,
	`transactionType` text,
	FOREIGN KEY (`addedBy`) REFERENCES `UserLists`(`userId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryType`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transactionType`) REFERENCES `TransactionType`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_TransactionLists`("description", "amount", "createdDate", "modifiedDate", "id", "addedBy", "categoryType", "transactionType") SELECT "description", "amount", "createdDate", "modifiedDate", "id", "addedBy", "categoryType", "transactionType" FROM `TransactionLists`;--> statement-breakpoint
DROP TABLE `TransactionLists`;--> statement-breakpoint
ALTER TABLE `__new_TransactionLists` RENAME TO `TransactionLists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;