import { createTrace } from 'src/trace';
import { ZipkinExporter } from 'src/exporters/zipkin';

interface Env {}

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext) {
		const exporter = new ZipkinExporter();
		const trace = createTrace(req, env, ctx, {
			serviceName: 'traced-fetch',
			collector: {
				url: 'http://0.0.0.0:9411/api/v2/spans', // Zipkin compatible Jaeger endpoint
				exporter: exporter,
			},
		});

		const url = new URL(req.url);
		const address = url.searchParams.get('address');
		const port = url.searchParams.get('port');

		const res = await trace.tracedFetch(`http://${address}:${port}/test`);
		const context = await res.json<{ traceId: string, parentId: string }>();

		await trace.send();
		return new Response('ok', {
			headers: {
				'trace-id': trace.getTraceId(),
				'span-id': trace.getChildSpans()[0].getSpanId(),
				'fetched-trace-id': context.traceId,
				'fetched-parent-id': context.parentId,
			},
		});
	},
};