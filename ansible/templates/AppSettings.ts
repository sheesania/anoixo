export const ServerSettings = {
  apiUrl: '{{ "https" if enable_https else "http" }}://{{ server_name }}/api',
};

export const FEEDBACK_FORM_URL = "{{ feedback_form_url }}";
