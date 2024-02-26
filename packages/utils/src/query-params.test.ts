import { routeWithParams } from "./query-params";

describe("routeWithParams", () => {
  test.each([
    ["", {}, ""],
    [null, {}, ""],
    [undefined, {}, ""],
    ["/resource/:id", {}, "/resource/:id"],
    ["/resource/:id", { id: "1" }, "/resource/1"],
    ["/resource", { page: "1", perPage: "20" }, "/resource?page=1&perPage=20"],
    ["/resource", { color: null }, "/resource?"],
    ["/resource", { color: undefined }, "/resource?"],
    [
      "/resource/:id",
      { id: "1", page: "1", perPage: "20", color: "red", shape: "" },
      "/resource/1?page=1&perPage=20&color=red&shape=",
    ],
    ["/resource/:fake", { id: "1" }, "/resource/:fake?id=1"],
  ])("should convert %s to %s", (path, params, expected) => {
    expect(routeWithParams(path, params)).toEqual(expected);
  });
});
