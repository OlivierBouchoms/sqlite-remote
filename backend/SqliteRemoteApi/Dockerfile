FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build-env

WORKDIR /app

COPY SqliteRemoteApi .

RUN dotnet restore
RUN dotnet publish --no-restore --configuration Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=build-env /app/out .

RUN mkdir /app/.ssh && touch /app/.ssh/config

ENTRYPOINT ["dotnet", "SqliteRemoteApi.dll"]