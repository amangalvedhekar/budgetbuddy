PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_BudgetedData` (
	`categoryType` text,
	`userId` text,
	`value` real DEFAULT 0,
	PRIMARY KEY(`userId`, `categoryType`),
	FOREIGN KEY (`categoryType`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `UserLists`(`userId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_BudgetedData`("categoryType", "userId", "value") SELECT "categoryType", "userId", "value" FROM `BudgetedData`;--> statement-breakpoint
DROP TABLE `BudgetedData`;--> statement-breakpoint
ALTER TABLE `__new_BudgetedData` RENAME TO `BudgetedData`;--> statement-breakpoint
PRAGMA foreign_keys=ON;