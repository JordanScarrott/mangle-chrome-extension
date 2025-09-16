import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.128.0/testing/asserts.ts";
import "@/mangle/wasm_exec.js";

const MANGLE_WASM_DIR = "src/mangle/mangle.wasm";

async function runMangleInstance(wasmPath) {
    const go = new Go();
    const wasmBytes = await Deno.readFile(wasmPath);
    const wasmModule = new WebAssembly.Module(wasmBytes);
    const instance = new WebAssembly.Instance(wasmModule, go.importObject);
    go.run(instance);
    return instance;
}

Deno.test("mangle wasm", async () => {
    await runMangleInstance(MANGLE_WASM_DIR);

    const expectedResult = [
        {
            X: "1",
            Y: "2",
        },
    ];
    const expectedResult2 = [
        {
            X: '"baz"',
        },
    ];

    let err = mangleDefine("foo(1, 2).");
    assertEquals(err, null);

    err = mangleDefine('bar("baz").');
    assertEquals(err, null);

    const result = mangleQuery("foo(X, Y)");
    assertEquals(result.trim(), '[{"X":"1","Y":"2"}]');
    assertEquals(JSON.parse(result.trim()), expectedResult);

    const result2 = mangleQuery("bar(X)");
    assertEquals(result2.trim(), '[{"X":"\\"baz\\""}]');
    assertEquals(JSON.parse(result2.trim()), expectedResult2);

    const errResult = mangleQuery("foo(");
    assert(errResult.startsWith("Error:"));
});

Deno.test("mangle basic tests", async () => {
    await runMangleInstance(MANGLE_WASM_DIR);

    // --- 1. Define your facts (these need the '.') ---
    mangleDefine('lives_in("Leo", "Paris").');
    mangleDefine('lives_in("Mia", "Tokyo").');
    mangleDefine('lives_in("Zoe", "Paris").');
    mangleDefine('travels_to("Mia", "Paris").');

    // --- 2. Query the data (without the '?') ---

    // This query asks: "Who lives in Paris?"
    const result1 = mangleQuery('lives_in(Name, "Paris")');
    assertEquals(result1, '[{"Name":"\\"Leo\\""},{"Name":"\\"Zoe\\""}]');

    // This is the JOIN query.
    // It asks: "Find the names of people who live in the city that Mia travels to."
    const result2 = mangleQuery(
        'travels_to("Mia", Destination), lives_in(Name, Destination)'
    );
    assertEquals(result2, '[{"Destination":"\\"Paris\\""}]');

    // Log your results to see the output
    // console.log("People who live in Paris:", result1);
    // console.log("People who live where Mia travels:", result2);
});

Deno.test("mangle basic tests", async () => {
    await runMangleInstance(MANGLE_WASM_DIR);

    // --- 1. Define facts ---
    mangleDefine('lives_in("Leo", "Paris").');
    mangleDefine('lives_in("Mia", "Tokyo").');
    mangleDefine('lives_in("Zoe", "Paris").');
    mangleDefine('travels_to("Mia", "Paris").');

    // --- 2. Define a RULE for the join ---
    // This rule, named 'visitorAndLocal', finds pairs of travelers (V) and locals (L)
    // who are in the same destination city (D).
    const rule =
        "visitorAndLocal(V, L, D) :- travels_to(V, D), lives_in(L, D).";
    mangleDefine(rule);

    // --- 3. Query the facts and the new rule ---

    // This query asks: "Who lives in Paris?" (This already worked)
    const result1 = mangleQuery('lives_in(Name, "Paris")');
    assertEquals(result1, '[{"Name":"\\"Leo\\""},{"Name":"\\"Zoe\\""}]');

    // This query now asks: "Who are the visitors and locals based on our rule where the visitor is Mia?"
    const result2 = mangleQuery('visitorAndLocal("Mia", Name, Destination)');

    // The expected result should contain both variables
    const expected = [
        { Destination: '"Paris"', Name: '"Leo"' },
        { Destination: '"Paris"', Name: '"Zoe"' },
    ];

    // Use JSON.parse for a more robust comparison
    assertEquals(JSON.parse(result2), expected);
});
