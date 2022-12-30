interface TraceData {
	// 8 bit field currently only used to indicate sampling
	// https://www.w3.org/TR/trace-context/#trace-flags
	flags?: number;

	spans: Span[];
}

interface SpanContext {
	// Globally unique ID for this specific trace event
	// 16 bytes, should be random rather than computed.
	// https://www.w3.org/TR/trace-context/#trace-id
	// https://www.w3.org/TR/trace-context/#considerations-for-trace-id-field-generation
	traceId: string;

	// Globally unique ID for this span
	// 8 bytes, should be random rather than computed
	spanId: string;
}

interface SpanData {
	// Globally unique ID for this specific trace event
	// 16 bytes, should be random rather than computed.
	// https://www.w3.org/TR/trace-context/#trace-id
	// https://www.w3.org/TR/trace-context/#considerations-for-trace-id-field-generation
	traceId: string;

	// Span ID of the parent or undefined if there is no parent present.
	// https://www.w3.org/TR/trace-context/#parent-id
	parentId?: string;

	// Name of the span
	name: string;

	// Globally unique ID for this span
	// 8 bytes, should be random rather than computed
	id: string;

	// The creation time of the span, epoch unix timestamp
	// https://opentelemetry.io/docs/reference/specification/trace/api/#timestamp
	timestamp: number;

	// The duration of the span, this is the elapsed time.
	// https://opentelemetry.io/docs/reference/specification/trace/api/#duration
	duration: number;

	// Attributes (or tags) attached to the span. These can be used to attach details like URL path, status code, etc.
	// https://opentelemetry.io/docs/reference/specification/common/#attribute
	attributes: Attributes;

	// https://opentelemetry.io/docs/reference/specification/trace/api/#set-status
	status: Status;

	// Events
	events: SpanEvent[];

	// Links to spans in this or other traces
	links: SpanLink[];
}

interface SpanCreationOptions {
	// Span ID of the parent or undefined if there is no parent present.
	// https://www.w3.org/TR/trace-context/#parent-id
	parentId?: string;

	// The creation time of the span, epoch unix timestamp
	// https://opentelemetry.io/docs/reference/specification/trace/api/#timestamp
	timestamp?: number;

	// The duration of the span, this is the elapsed time.
	// https://opentelemetry.io/docs/reference/specification/trace/api/#duration
	duration?: number;

	// Attributes (or tags) attached to the span. These can be used to attach details like URL path, status code, etc.
	// https://opentelemetry.io/docs/reference/specification/common/#attribute
	attributes?: Attributes;

	// https://opentelemetry.io/docs/reference/specification/trace/api/#set-status
	status?: Status;

	// Events
	events?: SpanEvent[];

	// Links to spans in this or other traces
	links?: SpanLink[];
}

interface Attributes {
	[key: string]: Attribute;
}

type Attribute = string | number | boolean | string[] | number[] | boolean[];

interface Status {
	code: StatusCode;
	message?: string;
}

enum StatusCode {
	UNSET = 0,
	OK 		= 1,
	ERROR = 2,
}

interface SpanEvent {
	// Name of the event
	name: string;

	// Time of the event, this will be when the event is added if no timestamp is provided
	timestamp: number;

	// Attributes (or tags) attached to the span. These can be used to attach details like URL path, status code, etc.
	// https://opentelemetry.io/docs/reference/specification/common/#attribute
	attributes?: Attributes;
}

interface SpanLink {
	context: SpanContext;
	attributes: Attributes;
}

interface TracerOptions {
	serviceName: string;
	collector: CollectorOptions;
	resource?: ResourceOptions;
	traceContext?: SpanContext;
	transformer?: any; // TODO: Move to CollectorOptions
}

interface CollectorOptions {
	url: string;
	headers?: HeadersInit;
}

interface ResourceOptions {
	attributes?: Attributes;
}

type CfWithTrace = IncomingRequestCfProperties & {
	traceContext?: SpanContext;
}

type TracedFn<T> = (...args: any[]) => T;
