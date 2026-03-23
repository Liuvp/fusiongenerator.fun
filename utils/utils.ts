import { redirect } from "next/navigation";

function buildRedirectPath(
  path: string,
  params: Record<string, string | undefined>,
) {
  const [pathname, existingQuery = ""] = path.split("?");
  const searchParams = new URLSearchParams(existingQuery);

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
  extraParams: Record<string, string | undefined> = {},
) {
  return redirect(
    buildRedirectPath(path, {
      ...extraParams,
      [type]: message,
    }),
  );
}
