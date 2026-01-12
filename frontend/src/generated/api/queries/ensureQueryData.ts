// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseServerServiceGetApiServerConnectionData = (queryClient: QueryClient, { dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }: {
  dbPath?: string;
  hostHostName?: string;
  hostIdentityFilePath?: string;
  hostPort?: number;
  hostUser?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }), queryFn: () => ServerService.getApiServerConnection({ dbPath, hostHostName, hostIdentityFilePath, hostPort, hostUser }) });
export const ensureUseTableServiceGetApiTableData = (queryClient: QueryClient, { dbPath, hostName, identityFilePath, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  port?: number;
  user?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, hostName, identityFilePath, port, user }), queryFn: () => TableService.getApiTable({ dbPath, hostName, identityFilePath, port, user }) });
export const ensureUseTableServiceGetApiTableByNameDataData = (queryClient: QueryClient, { dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, hostName, identityFilePath, name, port, user }), queryFn: () => TableService.getApiTableByNameData({ dbPath, hostName, identityFilePath, name, port, user }) });
export const ensureUseTableServiceGetApiTableByNameSchemaData = (queryClient: QueryClient, { dbPath, hostName, identityFilePath, name, port, user }: {
  dbPath?: string;
  hostName?: string;
  identityFilePath?: string;
  name: string;
  port?: number;
  user?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, hostName, identityFilePath, name, port, user }), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, hostName, identityFilePath, name, port, user }) });
