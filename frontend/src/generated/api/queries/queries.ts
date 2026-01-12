// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import { ServerQueryRequestDto } from "../requests/types.gen";
import * as Common from "./common";
export const useServerServiceGetApiServerConnection = <TData = Common.ServerServiceGetApiServerConnectionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }: {
  dbPath?: string;
  hostHostName?: string;
  hostIdentityFilePath?: string;
  hostPort?: number;
  hostUser?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }, queryKey), queryFn: () => ServerService.getApiServerConnection({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }) as TData, ...options });
export const useTableServiceGetApiTable = <TData = Common.TableServiceGetApiTableDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostName, identityFilePath, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  port?: number;
  user?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, hostName, identityFilePath, port, user }, queryKey), queryFn: () => TableService.getApiTable({ dbPath, hostName, identityFilePath, port, user }) as TData, ...options });
export const useTableServiceGetApiTableByNameData = <TData = Common.TableServiceGetApiTableByNameDataDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, hostName, identityFilePath, name, port, user }, queryKey), queryFn: () => TableService.getApiTableByNameData({ dbPath, hostName, identityFilePath, name, port, user }) as TData, ...options });
export const useTableServiceGetApiTableByNameSchema = <TData = Common.TableServiceGetApiTableByNameSchemaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, hostName, identityFilePath, name, port, user }, queryKey), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, hostName, identityFilePath, name, port, user }) as TData, ...options });
export const useServerServicePostApiServerQuery = <TData = Common.ServerServicePostApiServerQueryMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: ServerQueryRequestDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: ServerQueryRequestDto;
}, TContext>({ mutationFn: ({ requestBody }) => ServerService.postApiServerQuery({ requestBody }) as unknown as Promise<TData>, ...options });
