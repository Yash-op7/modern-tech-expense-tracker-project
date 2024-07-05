import { createFileRoute } from '@tanstack/react-router'
import { api } from "@/lib/api"
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute ('/about')({
  component: Profile,
})



async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json();
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser
  });

function Profile() {
  return <div className="p-2">Hello from Profile!</div>
}
