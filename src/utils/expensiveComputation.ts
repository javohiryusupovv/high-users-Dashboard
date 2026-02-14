
export const expensiveComputation = (userString: string): string => {
    // Simulate heavy computation
    const start = performance.now();
    while (performance.now() - start < 1) {
        // block for 1ms per row render to simulate load
        Math.random();
    }
    return `Processed: ${userString.length} chars`;
};
