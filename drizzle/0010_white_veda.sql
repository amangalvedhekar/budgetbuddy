ALTER TABLE `TransactionLists` ADD `isDeleted` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `TransactionLists` ADD `deletedDate` text;