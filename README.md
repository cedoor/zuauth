<p align="center">
    <h1 align="center">
        ZuAuth
    </h1>
    <p align="center">A simple toolkit designed to streamline the development of a zero-knowledge authentication system with Zupass tickets.</p>
</p>

<p align="center">
    <a href="https://github.com/proofcarryingdata">
        <img src="https://img.shields.io/badge/project-PCD-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/cedoor/zuauth/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/cedoor/zuauth.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/zuauth">
        <img alt="NPM version" src="https://img.shields.io/npm/v/zuauth?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/zuauth">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/zuauth.svg?style=flat-square" />
    </a>
</p>

|  The repository includes the `zuauth` package and a commented example demonstrating how to create an authentication system using NextJS and IronSession. Use the [demo](https://zuauth.vercel.app/) and refer to the [tutorial](/#-tutorial) section below to understand how to integrate `zuauth` into your app. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## 🛠 Install

Install the `zuauth` package with npm:

```bash
npm i zuauth
```

or yarn:

```bash
yarn add zuauth
```

## 📜 Tutarial

> [!NOTE]  
> The example in the repository uses [`iron-session`](https://github.com/vvo/iron-session) to manage sessions, but you are of course free to integrate your preferred solution.

First, you need to create the server-side logic to generate a session nonce and perform the authentication. The example in this repository includes four functions: [login](example/src/pages/api/login.ts), [logout](example/src/pages/api/logout.ts), [nonce](example/src/pages/api/nonce.ts), and [user](example/src/pages/api/user.ts). Remember to add all necessary checks in your login function, particularly ensuring that the ticket has been issued by Zupass and that it is among the supported tickets.

Next, you can proceed with the client side.

1. Create a page for the Zupass popup:

https://github.com/cedoor/zuauth/blob/979fd10cd2f8df1724446377976a51d4a6f13c9a/example/src/pages/popup.tsx#L1-L10

2. Create another page for your app and check if users are logged in:

https://github.com/cedoor/zuauth/blob/979fd10cd2f8df1724446377976a51d4a6f13c9a/example/src/pages/index.tsx#L7-L18

3. Create a function to login, which generates a nonce and user's PCD:

https://github.com/cedoor/zuauth/blob/979fd10cd2f8df1724446377976a51d4a6f13c9a/example/src/pages/index.tsx#L20-L36

4. Check when the PCD is generated and returned by the Zupass popup to call the login API:

https://github.com/cedoor/zuauth/blob/979fd10cd2f8df1724446377976a51d4a6f13c9a/example/src/pages/index.tsx#L38-L48

> [!IMPORTANT]  
> When the user interacts with the Zupass popup, the output, which is the generated PCD, is not returned by any function but can be found in the `pcd` state variable within the `useZuAuth` hook. It's important to check if the value is defined.

5. Create a function to allow users to log out:

https://github.com/cedoor/zuauth/blob/979fd10cd2f8df1724446377976a51d4a6f13c9a/example/src/pages/index.tsx#L50-L55

6. Create your UI:

https://github.com/cedoor/zuauth/blob/979fd10cd2f8df1724446377976a51d4a6f13c9a/example/src/pages/index.tsx#L97-L106
