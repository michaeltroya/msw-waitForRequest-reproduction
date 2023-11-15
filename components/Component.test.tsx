import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http, server } from "../mocks/server";
import Component from "./Component";

// this logs without any issue
server.events.on("request:start", async ({ request, requestId }) => {
  const body = await request.clone().json();

  console.log("Outgoing request:", request.method, request.url, { body });
});

//  updated wating for request function migrated from previous docs

const waitForRequest = <T,>(method: string, url: string): Promise<T> => {
  let reqId = "";

  return new Promise<T>((resolve, reject) => {
    server.events.on("request:start", async ({ request, requestId }) => {
      const matchesMethod =
        request.method.toLowerCase() === method.toLowerCase();
      const matchesUrl = request.url === url;

      if (matchesMethod && matchesUrl) {
        reqId = requestId;
      }
    });
    server.events.on("request:match", async ({ request, requestId }) => {
      const actualBody = await request.clone().json();
      if (requestId === reqId) resolve(actualBody);
    });
    server.events.on("request:unhandled", ({ request, requestId }) => {
      if (requestId === reqId) {
        reject(
          new Error(
            `The ${request.method} ${request.url} request was unhandled.`
          )
        );
      }
    });
  });
};

it("working - body not parsed", async () => {
  server.use(
    http.post("/reviews", () =>
      HttpResponse.json([
        {
          id: "60333292-7ca1-4361-bf38-b6b43b90cb16",
          author: "John Maverick",
          text: "Lord of The Rings, is with no absolute hesitation, my most favored and adored book by‑far. The trilogy is wonderful‑ and I really consider this a legendary fantasy series. It will always keep you at the edge of your seat‑ and the characters you will grow and fall in love with!",
        },
      ])
    )
  );

  render(<Component />);

  const req = waitForRequest("POST", "/reviews");

  userEvent.click(screen.getByText("Load reviews"));

  await waitFor(() => screen.getByText("John Maverick"));

  expect(req).resolves.toEqual({ foo: "bar" });
});

it("broken - body parsed but not cloned", async () => {
  server.use(
    http.post("/reviews", async ({ request }) => {
      const body = request.json();

      // do something with body

      return HttpResponse.json([
        {
          id: "60333292-7ca1-4361-bf38-b6b43b90cb16",
          author: "John Maverick",
          text: "Lord of The Rings, is with no absolute hesitation, my most favored and adored book by‑far. The trilogy is wonderful‑ and I really consider this a legendary fantasy series. It will always keep you at the edge of your seat‑ and the characters you will grow and fall in love with!",
        },
      ]);
    })
  );

  render(<Component />);

  const req = waitForRequest("POST", "/reviews");

  userEvent.click(screen.getByText("Load reviews"));

  await waitFor(() => screen.getByText("John Maverick"));

  expect(req).resolves.toEqual({ foo: "bar" });
});

it("working - clone body first", async () => {
  server.use(
    http.post("/reviews", async ({ request }) => {
      const body = request.clone().json(); // should this be the defacto way to do this inside the docs?

      return HttpResponse.json([
        {
          id: "60333292-7ca1-4361-bf38-b6b43b90cb16",
          author: "John Maverick",
          text: "Lord of The Rings, is with no absolute hesitation, my most favored and adored book by‑far. The trilogy is wonderful‑ and I really consider this a legendary fantasy series. It will always keep you at the edge of your seat‑ and the characters you will grow and fall in love with!",
        },
      ]);
    })
  );

  render(<Component />);

  const req = waitForRequest("POST", "/reviews");

  userEvent.click(screen.getByText("Load reviews"));

  await waitFor(() => screen.getByText("John Maverick"));

  expect(req).resolves.toEqual({ foo: "bar" });
});
