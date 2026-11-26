# Build: docker build -t campath-api ./backend
# Run:   docker run -p 5080:8080 -e Jwt__SigningKey="<32+ random bytes>" -v campath-data:/data campath-api
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY src/CamPath.Api/CamPath.Api.csproj src/CamPath.Api/
RUN dotnet restore src/CamPath.Api/CamPath.Api.csproj
COPY src/ src/
RUN dotnet publish src/CamPath.Api/CamPath.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://+:8080 \
    ConnectionStrings__Default="Data Source=/data/campath.db"
RUN mkdir -p /data && chown app:app /data
VOLUME /data
EXPOSE 8080
USER app
ENTRYPOINT ["dotnet", "CamPath.Api.dll"]
