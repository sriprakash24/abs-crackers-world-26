function getToken() {
    return localStorage.getItem("token");
}

async function apiRequest(url, method = "GET", body = null, isFormData = false) {

    const headers = {};

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    headers["Authorization"] = "Bearer " + getToken();

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
        alert("Unauthorized. Please login again.");
        window.location.href = "index.html";
        return;
    }

    return response;
}