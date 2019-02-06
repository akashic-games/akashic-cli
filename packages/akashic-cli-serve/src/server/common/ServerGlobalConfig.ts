export interface ServerGlobalConfig {
	hostname: string;
	port: number;
	useGivenHostname: boolean; // サーバー起動時にhostnameオプションが指定されたかどうか
	useGivenPort: boolean; // サーバー起動時にportオプションが指定されたかどうか
}

export const DEFAULT_HOSTNAME = "localhost";
export const DEFAULT_PORT = 3300;

export const serverGlobalConfig: ServerGlobalConfig = {
	hostname: DEFAULT_HOSTNAME,
	port: DEFAULT_PORT,
	useGivenHostname: false,
	useGivenPort: false
};
