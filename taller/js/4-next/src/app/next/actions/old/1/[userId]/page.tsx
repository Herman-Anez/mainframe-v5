import { getUser } from "../../../../../../../../1-node/fakeDb/data-access/user";
import { updateNameAction } from "./actios";

//Se agrega ek async para poder pedir datos antes de devolver la pagina
// Se agregan los parametros de la url a la funcion
export default async function UsersPage({
  ...params
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