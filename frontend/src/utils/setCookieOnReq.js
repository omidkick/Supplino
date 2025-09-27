export default async function setCookieOnReq() {
  const cookies = await import("next/headers").then((mod) => mod.cookies());

  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");

  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `${accessToken?.name}=${accessToken?.value}; ${refreshToken?.name}=${refreshToken?.value};`,
    },
  };
  return options;
}
