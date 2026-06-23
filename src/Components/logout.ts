'use server'

import { cookies } from "next/headers"


export const logoutAction = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('user')
}