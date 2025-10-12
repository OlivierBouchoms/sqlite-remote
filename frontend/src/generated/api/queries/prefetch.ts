// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { ServerService, TableService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseServerServiceGetApiServerConnection = (queryClient: QueryClient, { dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseServerServiceGetApiServerConnectionKeyFn({ dbPath, sshHost }), queryFn: () => ServerService.getApiServerConnection({ dbPath, sshHost }) });
export const prefetchUseTableServiceGetApiTable = (queryClient: QueryClient, { dbPath, sshHost }: {
  dbPath?: string;
  sshHost?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseTableServiceGetApiTableKeyFn({ dbPath, sshHost }), queryFn: () => TableService.getApiTable({ dbPath, sshHost }) });
export const prefetchUseTableServiceGetApiTableByNameData = (queryClient: QueryClient, { dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTableServiceGetApiTableByNameDataKeyFn({ dbPath, name, sshHost }), queryFn: () => TableService.getApiTableByNameData({ dbPath, name, sshHost }) });
export const prefetchUseTableServiceGetApiTableByNameSchema = (queryClient: QueryClient, { dbPath, name, sshHost }: {
  dbPath?: string;
  name: string;
  sshHost?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTableServiceGetApiTableByNameSchemaKeyFn({ dbPath, name, sshHost }), queryFn: () => TableService.getApiTableByNameSchema({ dbPath, name, sshHost }) });
