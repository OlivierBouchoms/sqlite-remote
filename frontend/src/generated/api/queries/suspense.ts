// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import * as Common from "./common";
export const useServerServiceGetApiServerConnectionSuspense = <TData = Common.ServerServiceGetApiServerConnectionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }: {
  dbPath?: string;
  hostHostName?: string;
  hostIdentityFilePath?: string;
  hostPort?: number;
  hostUser?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }, queryKey), queryFn: () => ServerService.getApiServerConnection({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }) as TData, ...options });
export const useTableServiceGetApiTableSuspense = <TData = Common.TableServiceGetApiTableDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostName, identityFilePath, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  port?: number;
  user?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, hostName, identityFilePath, port, user }, queryKey), queryFn: () => TableService.getApiTable({ dbPath, hostName, identityFilePath, port, user }) as TData, ...options });
export const useTableServiceGetApiTableByNameDataSuspense = <TData = Common.TableServiceGetApiTableByNameDataDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, hostName, identityFilePath, name, port, user }, queryKey), queryFn: () => TableService.getApiTableByNameData({ dbPath, hostName, identityFilePath, name, port, user }) as TData, ...options });
export const useTableServiceGetApiTableByNameSchemaSuspense = <TData = Common.TableServiceGetApiTableByNameSchemaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, hostName, identityFilePath, name, port, user }, queryKey), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, hostName, identityFilePath, name, port, user }) as TData, ...options });
