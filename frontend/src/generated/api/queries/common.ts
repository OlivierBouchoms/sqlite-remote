// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
export type ServerServiceGetApiServerConnectionDefaultResponse = Awaited<ReturnType<typeof ServerService.getApiServerConnection>>;
export type ServerServiceGetApiServerConnectionQueryResult<TData = ServerServiceGetApiServerConnectionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useServerServiceGetApiServerConnectionKey = "ServerServiceGetApiServerConnection";
export const UseServerServiceGetApiServerConnectionKeyFn = ({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }: {
  dbPath?: string;
  hostHostName?: string;
  hostIdentityFilePath?: string;
  hostPort?: number;
  hostUser?: string;
} = {}, queryKey?: Array<unknown>) => [useServerServiceGetApiServerConnectionKey, ...(queryKey ?? [{ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }])];
export type TableServiceGetApiTableDefaultResponse = Awaited<ReturnType<typeof TableService.getApiTable>>;
export type TableServiceGetApiTableQueryResult<TData = TableServiceGetApiTableDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTableServiceGetApiTableKey = "TableServiceGetApiTable";
export const UseTableServiceGetApiTableKeyFn = ({ dbPath, hostName, identityFilePath, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  port?: number;
  user?: string;
} = {}, queryKey?: Array<unknown>) => [useTableServiceGetApiTableKey, ...(queryKey ?? [{ dbPath, hostName, identityFilePath, port, user }])];
export type TableServiceGetApiTableByNameDataDefaultResponse = Awaited<ReturnType<typeof TableService.getApiTableByNameData>>;
export type TableServiceGetApiTableByNameDataQueryResult<TData = TableServiceGetApiTableByNameDataDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTableServiceGetApiTableByNameDataKey = "TableServiceGetApiTableByNameData";
export const UseTableServiceGetApiTableByNameDataKeyFn = ({ dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}, queryKey?: Array<unknown>) => [useTableServiceGetApiTableByNameDataKey, ...(queryKey ?? [{ dbPath, hostName, identityFilePath, name, port, user }])];
export type TableServiceGetApiTableByNameSchemaDefaultResponse = Awaited<ReturnType<typeof TableService.getApiTableByNameSchema>>;
export type TableServiceGetApiTableByNameSchemaQueryResult<TData = TableServiceGetApiTableByNameSchemaDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTableServiceGetApiTableByNameSchemaKey = "TableServiceGetApiTableByNameSchema";
export const UseTableServiceGetApiTableByNameSchemaKeyFn = ({ dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}, queryKey?: Array<unknown>) => [useTableServiceGetApiTableByNameSchemaKey, ...(queryKey ?? [{ dbPath, hostName, identityFilePath, name, port, user }])];
export type ServerServicePostApiServerQueryMutationResult = Awaited<ReturnType<typeof ServerService.postApiServerQuery>>;
