'use server'

import { updateUser } from "../../../../../../../../1-node/fakeDb/data-access/user";
import { revalidatePath } from "next/cache";

export async function updateNameAction(
    prevState: {
        userId: string;
        name: string;
        message: string;
    },
    formData: FormData
) {
    const userId = prevState.userId;
    const newName = formData.get("name") as string;
    await updateUser(userId, newName)
    revalidatePath(`user/${userId}`)

    await new Promise((resolve) => setTimeout(resolve, 5000))
    return {
        userId: userId,
        name: newName,
        message: "success",
    }
}
