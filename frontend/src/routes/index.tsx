import { createFileRoute } from '@tanstack/react-router'


import { api } from "@/lib/api"
export const Route = createFileRoute('/')({
  component: Index,
})

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useQuery } from "@tanstack/react-query"

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get()
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json();
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent })

  if(error) return "An error has occurred: " + error.message;

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{isPending ? "..." : data.total}</p>
      </CardContent>
      <CardFooter>
        <p>END</p>
      </CardFooter>
    </Card>
  )
}

