FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o nosso arquivo de configuração personalizado
COPY nginx.conf /etc/nginx/conf.d/

