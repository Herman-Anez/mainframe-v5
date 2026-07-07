'use server'

import { updateUser } from "../../../../../../../../1-node/fakeDb/data-access/user";
import { revalidatePath } from "next/cache";

export async function updateNameAction(userId: string, formData: FormData) {
    const newName = formData.get("name") as string;
    await updateUser(userId, newName)
    revalidatePath(`user/${userId}`) //refresca la pagina para que muestre los datos neuvos
}

