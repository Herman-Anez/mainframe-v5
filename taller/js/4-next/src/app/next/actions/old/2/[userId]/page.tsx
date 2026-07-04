import { getUser } from "../../../../../../../../1-node/fakeDb/data-access/user";
import Form from "./form";

export default async function UsersPage({
  params,
}: { params: { userId: string } }) {
  const user = await getUser(params.userId)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-32 px-16 bg-white dark:bg-zinc-900 rounded-2xl shadow sm:items-start">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Ejemplo 2 — useActionState + useFormStatus
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Usuario: <span className="font-semibold text-zinc-800 dark:text-zinc-100">{user.name}</span>
        </p>
        <Form userId={user.id} />
      </main>
    </div>
  );
}


/*
ejemplo 1
import { getUser, updateUser } from "@/src/data-access/user";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { updateNameAction } from "./actios";

//Se agrega ek async para poder pedir datos antes de devolver la pagina
// Se agregan los parametros de la url a la funcion
export default async function UsersPage({
  params,
}: { userId: string }) {
  const user = await getUser(params.userId)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>user {user.name}</div>

        <form action={updateNameAction.bind(null, user.name)}>
          <input type="text" name="name" />
          <button>summit</button>

        </form>
      </main>
    </div>
  );
}


*/