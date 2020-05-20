export const ServerSettings = {
  apiUrl: '{{ "https" if https_enabled else "http" }}://{{ server_name }}/api',
};

export const FEEDBACK_FORM_URL = "{{ feedback_form_url }}";
