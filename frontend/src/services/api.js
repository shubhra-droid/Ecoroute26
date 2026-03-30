export async function getRoute(start, end, mode) {
    const response = await fetch("http://localhost:5000/api/route", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ start, end, mode })
    });
    return response.json();
}