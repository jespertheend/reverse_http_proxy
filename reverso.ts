import { parseArgs } from "https://deno.land/std@0.221.0/cli/parse_args.ts";
import { STATUS_CODE } from "https://deno.land/std@0.221.0/http/status.ts";

const args = parseArgs(Deno.args, {
	string: ["from", "to"],
	boolean: ["help"],
	alias: {
		from: "f",
		to: "t",
		help: "h",
	},
});

if (args.help) {
	console.log(`
Example Usage:

    reverso -f 8081 -t https://example.com/

    This command starts a reverse proxy for example.com. You can now visit
    http://localhost:8081/ in your browser, which should show the contents
    of example.com

Options:
    -h --help
        Show this help menu.

    -f --from
        The port to proxy from. When omitted, a random available port
        is assigned by the OS.

    -t --to
        The url to proxy.
  `);
	Deno.exit(0);
}

const toUrl = new URL(args.to || "");
console.log("proxying " + toUrl.href);

const port = parseInt(args.from || "-1", 10);

Deno.serve({
	port,
}, async (request) => {
	const url = new URL(request.url);
	url.protocol = toUrl.protocol;
	url.hostname = toUrl.hostname;
	url.port = toUrl.port;
	let proxyResponse;
	try {
		proxyResponse = await fetch(url.href, {
			headers: request.headers,
			method: request.method,
			body: request.body,
			redirect: "manual",
		});
	} catch {
		return new Response("Bad Gateway", {
			status: STATUS_CODE.BadGateway,
		});
	}
	return proxyResponse;
});
