declare module "cloudflare:workers" {
	type R2PutOptions = {
		httpMetadata?: {
			contentType?: string;
		};
	};

	type R2BucketBinding = {
		put(
			key: string,
			value: Uint8Array,
			options?: R2PutOptions,
		): Promise<unknown>;
		delete(key: string): Promise<void>;
	};

	export const env: {
		R2_BUCKET: R2BucketBinding;
	};
}
