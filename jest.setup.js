import React from "react";
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

window.React = React;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
