import { getUser } from "../../../../../../../../1-node/fakeDb/data-access/user";


import Form from "./form.component";
import withUserId from "./form.hoc";
const HocForm = withUserId(Form);


export default async function UsersPage({
  params,
}: { params: { userId: string } }) {
const user = await getUser(params.userId)
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-32 px-16 bg-white dark:bg-zinc-900 rounded-2xl shadow sm:items-start">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Ejemplo 4 — Server Action + Custom Hook + HOC
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Usuario: <span className="font-semibold text-zinc-800 dark:text-zinc-100">{user.name}</span>
        </p>
        <HocForm userId={user.id} />
      </main>
    </div>
  );
}



