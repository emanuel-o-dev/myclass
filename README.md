# myclass

Projeto feito para a materia de Desenvolvimento e Operações na Web apenas para fins de estudo 
Todos os direitos a # https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
# Instalar o multipass
    sudo snap install multipass

# Iniciar o multipass 

     multipass launch -n <name_exemplo> jammy

# Entrar no servidor
     multipass shell <name_exemplo>

# Maquina Web
## Instalar e configurar ngnix
  https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04
  
     sudo apt update
     sudo apt install nginx
     sudo ufw allow OpenSSH
     sudo ufw enable
     sudo ufw app list
     sudo ufw allow 'Nginx HTTP'
     sudo ufw allow 'Nginx HTTPS'
     sudo ufw status
     sudo systemctl reload nginx
     systemctl status nginx

  # Criação do arquivo da pagina
      sudo mkdir -p /var/www/myclass.com/html
   # Configuração da rota 
      sudo nano /etc/nginx/sites-available/myclass.com                                   
         server {
            listen      80;
            listen      443 ssl;
    
            ssl_certificate    tls/myclass.crt;
            ssl_certificate_key tls/myclass.key;
            ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
            ssl_ciphers         HIGH:!aNULL:!MD5;
    
            root /var/www/myclass.com/html;
            index index.html index.htm index.nginx-debian.html;
    
            server_name myclass.com www.myclass.com;
    
            location / {
                  try_files $uri  /index.html =404;
            }
            location /\.css {
                  default_type text/css;
            }
            location /\.js {
                    default_type text/js;
            }
        }

   # Linkar o arquivo de configuração para habilitado   
     sudo ln -s /etc/nginx/sites-available/myclass.com /etc/nginx/sites-enabled/

  # Remover linha de comentario em:
     sudo nano /etc/nginx/nginx.conf
     server_names_hash_bucket_size 64;
  # Testar nginx 
     sudo nginx -t 
     sudo systemctl restart nginx

# Maquina DB 
   https://www.hostinger.com.br/tutoriais/instalar-mongodb-ubuntu 
   
     curl -fsSL https://pgp.mongodb.com/server-7.0.asc |  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
     echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
     sudo apt-get update
   # Instalar o mongodb
     sudo apt-get install -y mongodb-org
   # Iniciar o servico
      sudo systemctl start mongod
     sudo systemctl enable mongod
   
  # Criar um novo banco de dados 
     mongosh
     use classroom
  # Criar um usuario com senha "123"
      db.createUser(
       {
         user: "root",
         pwd: "123",   
         roles: [
             { role: 'userAdminAnyDatabase', db: 'admin' },
            { role: 'readWriteAnyDatabase', db: 'admin' }
          ],
       }
    )

  # Testar a conexao de entrada
      mongosh --port 27017 -u root -p '123' 'classroom'
  # Habilitar conexão remota 
     sudo nano /etc/mongod.conf
      bindIp: 0.0.0.0  // ip de qualquer maquina
     sudo systemctl restart mongod

  // mongo "mongodb://usuário:senha@ip:porta/?authSource=nome_do_banco_de_dados"  link para conexão remota
   
# Maquina Dev
# clone do repositorio 
     git clone https://github.com/emanuel-o-dev/myclass.git
     cd myclass/backend 
  # Instalar as dependências
     npm i 
     mkdir tls
     sudo nano .env 
    // conexão com dns
     MONGODB_URI = mongodb://root:123@db.myclass.com:27017/?directConnection=true&serverSelectionTimeoutMS>
     PORT = 4000

## Maquina DNS 
     sudo apt-get install bind9
     sudo nano /etc/bind/named.conf.options
<br>
    
     dnssec-validation no;
     allow-query { 127.0.0.0/8; 10.118.254.0/24; }; // ip da bridge da maquina hospodeira
     listen-on-v6 { };
     
     // Se nao souber o IP voltar para a maquina hospedeira e usa o comando 
     //  ip -br -c a
     sudo systemctl restart bind
  # Editar configurações locais
     sudo nano /etc/bind/named.conf.local 
      zone "myclass.com" IN {
          type master;
          file "db.myclass.com";
      };
  # Criar arquivo de configuração
     sudo nano /var/cache/bind/db.myclass.com
      $ORIGIN myclass.com.
      $TTL 300;
      @ IN SOA dns emanueloliveiraandrade.alunos.utpr.edu.br (1 30 30 30 30);
      @ IN NS dns
      dns IN A 10.118.254.54
      ca IN A 10.118.254.2
      db IN A 10.118.254.138
      dev IN A 10.118.254.160
      @ IN A 10.118.254.85
      web IN CNAME @
      www IN CNAME @ 
       // usar multipass list para virificar os IPs na sua maquina

## Ajustar DNS na MAQUINA LOCAL
  
     sudo nano /etc/systemd/resolved.conf
      DNS=[IP-DO-SERVIDOR-DNS]
      FallbackDNS=[IP-DO-GATEWAY-MULTIPASS]
     sudo systemctl restart systemd-resolved

## Maquina CA 
     sudo apt-get install easy-rsa
    # Copiar a pasta para o home 
       cp -R /usr/share/easy-rsa/ .
      cd easy-rsa/
      mv vars.exemple vars
      sudo nano vars 
remover "#" e mudar para:
        
        set_var EASYRSA_DN      "org"
 mais abaixo 
 
        set_var EASYRSA_REQ_COUNTRY     "US"
        set_var EASYRSA_REQ_PROVINCE    "California"
        set_var EASYRSA_REQ_CITY        "San Francisco"
        set_var EASYRSA_REQ_ORG "CAMADA SA"
        set_var EASYRSA_REQ_EMAIL       "me@camada.net"
        set_var EASYRSA_REQ_OU          "CAMADA SA"
  # Iniciando a CA
     ./easy-rsa init-pki 
     ./easy-rsa build-ca 
      // Ele vai pedir uma senha, em ambiente real ela precisa ser muito bem protegida mas como estamos em ambiente
      // de apredizado vamos colocar "123"
     // apos ele vai pedir para confirmar as informações do certificado, em quase todos da pra deixar o padrão apena em 
     "Common Name: ..... " : camada.net

  # Instalar um navegador para disponibilizar o certificado pela web
      sudo apt-get install lighttpd
      sudo cp pki/ca.crt /var/www/html/
       # Alterar permissões do arquivo
       // alterar o dono do arquivo para ubuntu (usuario padrão)
        sudo chown ubuntu:ubuntu /var/www/html/ca.crt 
       // alterar a configurar de leitura do arquivo 
        sudo chmod 444 /var/www/html/ca.crt 
  

 https://github.com/vaamonde/ca-certificates/blob/main/03-services/03-nodejs-https.md




   
  
