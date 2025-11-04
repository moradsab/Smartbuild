// src/services/api.js
let jwt = null;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5678";

export function setToken(token) {
  jwt = token;
}

export function clearToken() {
  jwt = null;
}

async function request(path, options = {}, useAuth = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(useAuth && jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}

export async function sendCode(phone) {
  // no auth header
  return request("/webhook/send-code", {
    method: "POST",
    body: JSON.stringify({ phone }),
  }, false);
}

export async function verifyCode(phone, code) {
  // no auth header
  const data = await request("/webhook/verify-code", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  }, false);
  return data.token;
}


export async function getData() {
  const data = await request("/webhook/get-data", {
    method: "GET",
  });
  console.log(data)
  return data;
}

export async function addCustomer(customerData) {
  return request("/webhook/add-customer", {
    method: "POST",
    body: JSON.stringify(customerData),
  });
}

export async function transcribeRecording(audioBlob) {
  // Direct fetch because we need to send binary, not JSON
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const res = await fetch(`${API_URL}/webhook/transcribe-recording`, {
    method: "POST",
    body: formData,
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
    }
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Transcription failed: ${err}`);
  }

  const data = await res.json();
  return data.text; // Assuming the API returns { text: "transcription" }
}

export async function addVisit(formData) {
  const res = await fetch(`${API_URL}/webhook/add-visit`, {
    method: "POST",
    body: formData,
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      // DO NOT set Content-Type: multipart/form-data (browser sets it)
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to submit visit: ${err}`);
  }

  return res.json();
}

export async function getVisitById(visitId) {
  const data = await request("/webhook/get-visit", {
    method: "POST",
    body: JSON.stringify({ visitId }),
  });
  console.log(data,"get-visit")
  return data;
}

export async function createQuote(quoteData) {
  return request("/webhook-test/create-quote", {
    method: "POST",
    body: JSON.stringify(quoteData),
  });
}

// פונקציה חדשה לקבלת רשימת הצעות המחיר
export async function getQuotes() {
  return request("/webhook/get-quotes", {
    method: "GET",
  });
}


// פונקציה חדשה לקבלת הצעת מחיר בודדת לפי ID באמצעות POST
export async function getQuoteById( quoteData) {
  return request(`/webhook/get-quote`, {
    method: "POST",
    body: JSON.stringify(quoteData), // שליחת האובייקט המלא של הצעת המחיר
  });
}

// פונקציה חדשה לשמירת שינויים בהצעת מחיר קיימת
export async function saveQuote(quoteId, quoteText) {
  return request(`/webhook-test/save-quote/${quoteId}`, {
    method: "POST",
    body: JSON.stringify({ quoteText }),
  });
}


export default {
  setToken,
  clearToken,
  request,
  sendCode,
  verifyCode,
  getData,
  addCustomer,
  transcribeRecording,
  addVisit,
  getVisitById,
  createQuote,
  getQuotes,
  getQuoteById,
  saveQuote
};
