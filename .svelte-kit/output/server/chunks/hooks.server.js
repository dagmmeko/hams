import { d as dev } from "./environment.js";
import { d as private_env, b as base } from "./internal.js";
import { Auth } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import { p as prisma } from "./prisma.js";
import bcrypt from "bcrypt";
import { A as AUTH_SECRET } from "./private.js";
async function getSession(req, config) {
  config.secret ??= private_env.AUTH_SECRET;
  config.trustHost ??= true;
  const prefix = config.prefix ?? `${base}/auth`;
  const url = new URL(prefix + "/session", req.url);
  const request = new Request(url, { headers: req.headers });
  const response = await Auth(request, config);
  const { status = 200 } = response;
  const data = await response.json();
  if (!data || !Object.keys(data).length)
    return null;
  if (status === 200)
    return data;
  throw new Error(data.message);
}
const actions = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error"
];
function AuthHandle(svelteKitAuthOptions) {
  return async function({ event, resolve }) {
    const authOptions = typeof svelteKitAuthOptions === "object" ? svelteKitAuthOptions : await svelteKitAuthOptions(event);
    const { prefix = `${base}/auth` } = authOptions;
    const { url, request } = event;
    event.locals.getSession ??= () => getSession(request, authOptions);
    const action = url.pathname.slice(prefix.length + 1).split("/")[0];
    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      return resolve(event);
    }
    return Auth(request, authOptions);
  };
}
function SvelteKitAuth(options) {
  if (typeof options === "object") {
    options.secret ??= private_env.AUTH_SECRET;
    options.trustHost ??= !!(private_env.AUTH_TRUST_HOST ?? private_env.VERCEL ?? dev);
    options.prefix ??= `${base}/auth`;
  }
  return AuthHandle(options);
}
const authHook = SvelteKitAuth({
  providers: [
    CredentialsProvider({
      name: "Sign in with Email",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials.email) {
          throw new Error("Email not found");
        }
        if (!credentials.password || typeof credentials.password !== "string") {
          throw new Error("Password not found");
        }
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email
          }
        });
        if (!user) {
          throw new Error("User not found!");
        }
        if (!user.jwtPassword) {
          throw new Error("User password not set.");
        }
        const authorized = await bcrypt.compare(credentials.password, user.jwtPassword);
        if (!authorized) {
          throw new Error("User not Authorized");
        }
        return {
          id: user.id.toString(),
          name: user.userName,
          email: user.email
        };
      }
    })
  ],
  pages: {
    error: "/auth/signup-error"
  },
  secret: AUTH_SECRET,
  callbacks: {
    signIn: async (params) => {
      if (params.account?.provider === "credentials") {
        return true;
      }
      throw new Error("Account provider not known.");
    },
    jwt: async (params) => {
      if (!params.token?.email) {
        throw new Error("JWT email not found.");
      }
      const authUser = await prisma.user.findFirst({
        where: {
          email: params.token.email
        },
        select: {
          email: true,
          Employee: true,
          phoneNumber: true,
          userName: true,
          id: true
        }
      });
      return { ...params.token, authUser };
    },
    session: async (params) => {
      return {
        ...params.session,
        authUser: params.token.authUser
      };
    }
  }
});
function sequence(...handlers) {
  const length = handlers.length;
  if (!length)
    return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i, event2, parent_options) {
      const handle2 = handlers[i];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i < length - 1 ? apply_handle(i + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
const localeHook = async ({ event, resolve }) => {
  return resolve(event);
};
const handle = sequence(authHook, localeHook);
export {
  handle
};
