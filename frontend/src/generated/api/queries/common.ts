// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
export type ServerServiceGetApiServerConnectionDefaultResponse = Awaited<ReturnType<typeof ServerService.getApiServerConnection>>;
export type ServerServiceGetApiServerConnectionQueryResult<TData = ServerServiceGetApiServerConnectionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useServerServiceGetApiServerConnectionKey = "ServerServiceGetApiServerConnection";
export const UseServerServiceGetApiServerConnectionKeyFn = ({ dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}, queryKey?: Array<unknown>) => [useServerServiceGetApiServerConnectionKey, ...(queryKey ?? [{ dbPath, sshHost }])];
export type TableServiceGetApiTableDefaultResponse = Awaited<ReturnType<typeof TableService.getApiTable>>;
export type TableServiceGetApiTableQueryResult<TData = TableServiceGetApiTableDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTableServiceGetApiTableKey = "TableServiceGetApiTable";
export const UseTableServiceGetApiTableKeyFn = ({ dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}, queryKey?: Array<unknown>) => [useTableServiceGetApiTableKey, ...(queryKey ?? [{ dbPath, sshHost }])];
export type TableServiceGetApiTableByNameDataDefaultResponse = Awaited<ReturnType<typeof TableService.getApiTableByNameData>>;
export type TableServiceGetApiTableByNameDataQueryResult<TData = TableServiceGetApiTableByNameDataDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTableServiceGetApiTableByNameDataKey = "TableServiceGetApiTableByNameData";
export const UseTableServiceGetApiTableByNameDataKeyFn = ({ dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}, queryKey?: Array<unknown>) => [useTableServiceGetApiTableByNameDataKey, ...(queryKey ?? [{ dbPath, name, sshHost }])];
export type TableServiceGetApiTableByNameSchemaDefaultResponse = Awaited<ReturnType<typeof TableService.getApiTableByNameSchema>>;
export type TableServiceGetApiTableByNameSchemaQueryResult<TData = TableServiceGetApiTableByNameSchemaDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTableServiceGetApiTableByNameSchemaKey = "TableServiceGetApiTableByNameSchema";
export const UseTableServiceGetApiTableByNameSchemaKeyFn = ({ dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}, queryKey?: Array<unknown>) => [useTableServiceGetApiTableByNameSchemaKey, ...(queryKey ?? [{ dbPath, name, sshHost }])];
