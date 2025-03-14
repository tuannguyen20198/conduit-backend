export const constructDBUrl = ({
  dbUsername,
  dbPassword,
  dbHost,
  dbPort,
  dbName,
}) => {
  return `postgresql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
};
