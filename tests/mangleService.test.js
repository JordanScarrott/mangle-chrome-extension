import { assertEquals } from "asserts";
import { run_mangle_query } from "services/mangleService.js";

Deno.test("Mangle Service - Success Case", async () => {
  const validInput = `
    service("order-service").
    uses_library("order-service", "log4j", "2.14").
    vulnerable_version("log4j", "2.14").
    is_vulnerable(Svc) :-
      uses_library(Svc, Lib, Ver),
      vulnerable_version(Lib, Ver).
    is_vulnerable(Svc).
  `;

  const result = await run_mangle_query(validInput);

  assertEquals(result.status, "success");
  assertEquals(result.data, ["is_vulnerable(\"order-service\")."]);
});

Deno.test("Mangle Service - Error Case (Syntax Error)", async () => {
  const invalidInput = `
    // This query has a syntax error (missing dot)
    service("order-service")
    is_vulnerable(Svc).
  `;

  const result = await run_mangle_query(invalidInput);

  assertEquals(result.status, "error");
  // We can check if the message contains a relevant error string.
  // The exact message will depend on the Rust parser's output.
  assertEquals(typeof result.message, "string");
});

Deno.test("Mangle Service - No Results Case", async () => {
  const noResultInput = `
    service("order-service").
    uses_library("order-service", "log4j", "2.17").
    vulnerable_version("log4j", "2.14").
    is_vulnerable(Svc) :-
      uses_library(Svc, Lib, Ver),
      vulnerable_version(Lib, Ver).
    is_vulnerable(Svc).
  `;

  const result = await run_mangle_query(noResultInput);

  assertEquals(result.status, "success");
  assertEquals(result.data, []); // Expect an empty array
});

// --- TDD Spec Tests ---
// The following tests define functionality that is not yet
// implemented in the Wasm module. They are expected to fail
// until the features are built.

Deno.test("Mangle Spec - Basic Fact Retrieval", async () => {
  const input = `
    user("alice", "admin").
    user(U, R).
  `;
  const result = await run_mangle_query(input);
  assertEquals(result.status, "success");
  assertEquals(result.data, ['user("alice", "admin").']);
});

Deno.test("Mangle Spec - Multi-Variable Query", async () => {
  const input = `
    location("paris", "france").
    location("berlin", "germany").
    location(City, "germany").
  `;
  const result = await run_mangle_query(input);
  assertEquals(result.status, "success");
  assertEquals(result.data, ['location("berlin", "germany").']);
});

Deno.test("Mangle Spec - Multi-Step Rule Deduction", async () => {
  const input = `
    parent("a", "b").
    parent("b", "c").
    ancestor(X, Y) :- parent(X, Y).
    ancestor(X, Z) :- parent(X, Y), ancestor(Y, Z).
    ancestor("a", C).
  `;
  const result = await run_mangle_query(input);
  assertEquals(result.status, "success");
  assertEquals(result.data, ['ancestor("a", "b").', 'ancestor("a", "c").']);
});

Deno.test("Mangle Spec - Comment and Whitespace Handling", async () => {
  const input = `
    // This is a comment.
    fact("data").

    // Another comment with extra whitespace.

    fact(X).
  `;
  const result = await run_mangle_query(input);
  assertEquals(result.status, "success");
  assertEquals(result.data, ['fact("data").']);
});
