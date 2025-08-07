import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // disable automatic refetching on window focus
      retry:0 , // only retry failed requests once
      staleTime: 5 * 60 * 1000, // data is considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // cache is kept for 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// // Query keys for better organization and type safety
// export const queryKeys = {
//   // Admin-related query keys
//   admin: {
//     auth: {
//       login: ['admin', 'auth', 'login'],
//     },
//     dashboard: {
//       all: ['admin', 'dashboard'],
//     },
//     admins: {
//       all: ['admin', 'admins'],
//       lists: () => [...queryKeys.admin.admins.all, 'list'],
//       list: (page?: string) => [...queryKeys.admin.admins.lists(), { page }],
//       details: () => [...queryKeys.admin.admins.all, 'detail'],
//       detail: (id: string) => [...queryKeys.admin.admins.details(), id],
//     },
//     customers: {
//       all: ['admin', 'customers'],
//       lists: () => [...queryKeys.admin.customers.all, 'list'],
//       list: (page: string) => [...queryKeys.admin.customers.lists(), { page }],
//       details: () => [...queryKeys.admin.customers.all, 'detail'],
//       detail: (id: string) => [...queryKeys.admin.customers.details(), id],
//     },
//     employees: {
//       all: ['admin', 'employees'],
//       lists: () => [...queryKeys.admin.employees.all, 'list'],
//       list: () => [...queryKeys.admin.employees.lists()],
//       details: () => [...queryKeys.admin.employees.all, 'detail'],
//       detail: (id: string) => [...queryKeys.admin.employees.details(), id],
//       timesheet: (id: string, startDate?: string, endDate?: string) => 
//         [...queryKeys.admin.employees.detail(id), 'timesheet', { startDate, endDate }],
//     },
//     projects: {
//       all: ['admin', 'projects'],
//       lists: () => [...queryKeys.admin.projects.all, 'list'],
//       list: (page: string) => [...queryKeys.admin.projects.lists(), { page }],
//       details: () => [...queryKeys.admin.projects.all, 'detail'],
//       detail: (id: string) => [...queryKeys.admin.projects.details(), id],
//     },
//     finance: {
//       all: ['admin', 'finance'],
//       transactions: () => [...queryKeys.admin.finance.all, 'transactions'],
//       transaction: (id: string) => [...queryKeys.admin.finance.transactions(), id],
//     },
//     tickets: {
//       all: ['admin', 'tickets'],
//       lists: () => [...queryKeys.admin.tickets.all, 'list'],
//       list: () => [...queryKeys.admin.tickets.lists()],
//       details: () => [...queryKeys.admin.tickets.all, 'detail'],
//       detail: (ticketNumber: string) => [...queryKeys.admin.tickets.details(), ticketNumber],
//     },
//   },
  
//   // User-related query keys
//   user: {
//     auth: {
//       signIn: ['user', 'auth', 'signIn'],
//     },
//     dashboard: {
//       home: ['user', 'dashboard', 'home'],
//     },
//     projects: {
//       all: ['user', 'projects'],
//       lists: () => [...queryKeys.user.projects.all, 'list'],
//       list: () => [...queryKeys.user.projects.lists()],
//     },
//     tickets: {
//       all: ['user', 'tickets'],
//       lists: () => [...queryKeys.user.tickets.all, 'list'],
//       list: () => [...queryKeys.user.tickets.lists()],
//       details: () => [...queryKeys.user.tickets.all, 'detail'],
//       detail: (id: string) => [...queryKeys.user.tickets.details(), id],
//     },
//     invoices: {
//       all: ['user', 'invoices'],
//       lists: () => [...queryKeys.user.invoices.all, 'list'],
//       list: () => [...queryKeys.user.invoices.lists()],
//     },
//     wallet: {
//       all: ['user', 'wallet'],
//       charge: () => [...queryKeys.user.wallet.all, 'charge'],
//       verifyCharge: () => [...queryKeys.user.wallet.all, 'verifyCharge'],
//       makePayment: () => [...queryKeys.user.wallet.all, 'makePayment'],
//     },
//   },
  
//   // General query keys that might be used across contexts
//   general: {
//     auth: {
//       user: ['auth', 'user'],
//       permissions: ['auth', 'permissions'],
//     },
//   },
// } as const; 


