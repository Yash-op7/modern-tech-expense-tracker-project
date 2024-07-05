import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions } from "@/lib/api"
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute ('/_authenticated/profile')({
  component: Profile,
})

// async function getCurrentUser() {
//   const res = await api.me.$get()
//   if (!res.ok) {
//     throw new Error("server error")
//   }
//   const data = await res.json();
//   return data
// }

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if(isPending) return "loading";  
  if(error) return "not logged in";

  return (
    <div className='p-2'>
      Hello from Profile!
      <p>Hello {data.user.family_name}</p>
    </div>
  )
}