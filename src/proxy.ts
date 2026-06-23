import { NextRequest, NextResponse } from "next/server";

export type TRole = 'ADMIN' | 'USER' | 'KASIR';
export interface IUser {
  username: string;
  role: TRole;
  no_telp: string;
}

export default function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("user")?.value;

  const { pathname } = request.nextUrl;
  const toUserPage = pathname.startsWith("/user");
  const toAdminPage = pathname.startsWith("/admin");
  const isNeedSession = toUserPage || toAdminPage;

  if (isNeedSession) {
    if (!userCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const user: IUser = JSON.parse(userCookie);
      
      if (user.role !== 'ADMIN' && toAdminPage) {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }

      if (user.role === 'ADMIN' && toUserPage) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

    } catch (error) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("user");
      return response;
    }
  }

  return NextResponse.next();
}