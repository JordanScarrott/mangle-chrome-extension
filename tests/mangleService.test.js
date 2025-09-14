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
