export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    if (!payload) throw new Error("Invalid token");

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalizedPayload));
    const expMs = decoded?.exp ? decoded.exp * 1000 : 0;

    if (!expMs || Date.now() >= expMs) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};
