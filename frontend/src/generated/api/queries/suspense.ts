// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import * as Common from "./common";
export const useServerServiceGetApiServerConnectionSuspense = <TData = Common.ServerServiceGetApiServerConnectionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, sshHost }, queryKey), queryFn: () => ServerService.getApiServerConnection({ dbPath, sshHost }) as TData, ...options });
export const useTableServiceGetApiTableSuspense = <TData = Common.TableServiceGetApiTableDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, sshHost }, queryKey), queryFn: () => TableService.getApiTable({ dbPath, sshHost }) as TData, ...options });
export const useTableServiceGetApiTableByNameDataSuspense = <TData = Common.TableServiceGetApiTableByNameDataDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, name, sshHost }, queryKey), queryFn: () => TableService.getApiTableByNameData({ dbPath, name, sshHost }) as TData, ...options });
export const useTableServiceGetApiTableByNameSchemaSuspense = <TData = Common.TableServiceGetApiTableByNameSchemaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, name, sshHost }, queryKey), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, name, sshHost }) as TData, ...options });
