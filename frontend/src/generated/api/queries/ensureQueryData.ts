// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseServerServiceGetApiServerConnectionData = (queryClient: QueryClient, { dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, sshHost }), queryFn: () => ServerService.getApiServerConnection({ dbPath, sshHost }) });
export const ensureUseTableServiceGetApiTableData = (queryClient: QueryClient, { dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, sshHost }), queryFn: () => TableService.getApiTable({ dbPath, sshHost }) });
export const ensureUseTableServiceGetApiTableByNameDataData = (queryClient: QueryClient, { dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, name, sshHost }), queryFn: () => TableService.getApiTableByNameData({ dbPath, name, sshHost }) });
export const ensureUseTableServiceGetApiTableByNameSchemaData = (queryClient: QueryClient, { dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, name, sshHost }), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, name, sshHost }) });
