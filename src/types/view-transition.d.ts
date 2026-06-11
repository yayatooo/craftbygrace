// src/types/view-transition.d.ts
interface ViewTransition {
	ready: Promise<void>;
	finished: Promise<void>;
	updateCallbackDone: Promise<void>;
	skipTransition(): void;
}

export interface Document {
	startViewTransition(callback?: () => void | Promise<void>): ViewTransition;
}
