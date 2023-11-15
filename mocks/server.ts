import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";
import { handlers } from "./handlers";

// eslint-disable-next-line import/prefer-default-export
const server = setupServer(...handlers);

export { http, server, HttpResponse, delay };
