import { type ApiRoutes } from "@server/app"
import {hc} from 'hono/client';
import { queryOptions } from "@tanstack/react-query";


const client = hc<ApiRoutes>('/')

export const api = client.api; 

async function getCurrentUser() {   // get the user details from teh server
    const res = await api.me.$get()
    if (!res.ok) {
      throw new Error("server error")
    }
    const data = await res.json();
    return data
  }
  

export const userQueryOptions = queryOptions({
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser,
    staleTime:Infinity      // cache the results, the cached value is not evicted untill we manually invalidate the cache which would happen if the user logs out or opens a new browser window
  });