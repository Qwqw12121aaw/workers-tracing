import { createTrace } from 'src/index';
import { ZipkinTransformer } from 'src/transformers/zipkin';
import { ATTRIBUTE_NAME, SPAN_NAME } from 'src/utils/constants';

interface Env {
	KV: KVNamespace;
}

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext) {
		const trace = createTrace(req, env, ctx, {
			serviceName: 'span-span-attributes',
			collector: {
				url: 'http://localhost:9411/api/v2/spans', // Zipkin compatible Jaeger endpoint
			},
			transformer: new ZipkinTransformer(),
		});

		const fetchSpan = trace.startSpan(SPAN_NAME.FETCH, {
			attributes: { [ATTRIBUTE_NAME.HTTP_HOST]: 'example.com' },
		});

		const res = await fetch('https://example.com');

		const kvSpan = fetchSpan.startSpan(SPAN_NAME.KV_GET, {
			attributes: { [ATTRIBUTE_NAME.KV_KEY]: 'abc' },
		});

		await env.KV.get('abc');
		kvSpan.end();
		fetchSpan.end();

		await trace.send();
		return new Response('ok', { headers: { 'x-trace-id': trace.getTraceId() } });
	},
}
