export type ServerSettings = {
    textServerUrl: string;
};

export const NLFServerSettings: ServerSettings = {
    textServerUrl: 'http://{{ server_name }}/api/text/nlf',
}