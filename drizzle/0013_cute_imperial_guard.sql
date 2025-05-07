PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_TransactionLists` (
	`description` text,
	`amount` integer NOT NULL,
	`createdDate` text DEFAULT (CURRENT_DATE),
	`modifiedDate` text,
	`id` text PRIMARY KEY NOT NULL,
	`addedBy` text,
	`categoryType` text,
	`transactionType` text,
	`isDeleted` integer DEFAULT false,
	`deletedDate` text,
	`isRecurringTransaction` text DEFAULT '',
	FOREIGN KEY (`addedBy`) REFERENCES `UserLists`(`userId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryType`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transactionType`) REFERENCES `TransactionType`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_TransactionLists`("description", "amount", "createdDate", "modifiedDate", "id", "addedBy", "categoryType", "transactionType", "isDeleted", "deletedDate", "isRecurringTransaction") SELECT "description", "amount", "createdDate", "modifiedDate", "id", "addedBy", "categoryType", "transactionType", "isDeleted", "deletedDate", "isRecurringTransaction" FROM `TransactionLists`;--> statement-breakpoint
DROP TABLE `TransactionLists`;--> statement-breakpoint
ALTER TABLE `__new_TransactionLists` RENAME TO `TransactionLists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;