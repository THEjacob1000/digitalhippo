import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("payload-token")?.value;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`;

  console.log(`Fetching user from: ${url}`);
  console.log(`Using token: ${token}`);

  try {
    const meRes = await fetch(url, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    const text = await meRes.text();

    if (!meRes.ok) {
      console.error("Failed to fetch user:", text);
      throw new Error(`Failed to fetch user: ${meRes.statusText}`);
    }

    try {
      const { user } = JSON.parse(text) as { user: User | null };
      return { user };
    } catch (jsonError) {
      console.error("Failed to parse JSON:", text);
      if (jsonError instanceof Error) {
        throw new Error(`Failed to parse JSON: ${jsonError.message}`);
      }
    }
  } catch (error) {
    console.error("Error in getServerSideUser:", error);
    if (error instanceof Error) {
      throw new Error(`Error in getServerSideUser: ${error.message}`);
    }
  }
};
