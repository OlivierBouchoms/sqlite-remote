// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseServerServiceGetApiServerConnection = (queryClient: QueryClient, { dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }: {
  dbPath?: string;
  hostHostName?: string;
  hostIdentityFilePath?: string;
  hostPort?: number;
  hostUser?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }), queryFn: () => ServerService.getApiServerConnection({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }) });
export const prefetchUseTableServiceGetApiTable = (queryClient: QueryClient, { dbPath, hostName, identityFilePath, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  port?: number;
  user?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, hostName, identityFilePath, port, user }), queryFn: () => TableService.getApiTable({ dbPath, hostName, identityFilePath, port, user }) });
export const prefetchUseTableServiceGetApiTableByNameData = (queryClient: QueryClient, { dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, hostName, identityFilePath, name, port, user }), queryFn: () => TableService.getApiTableByNameData({ dbPath, hostName, identityFilePath, name, port, user }) });
export const prefetchUseTableServiceGetApiTableByNameSchema = (queryClient: QueryClient, { dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, hostName, identityFilePath, name, port, user }), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, hostName, identityFilePath, name, port, user }) });
