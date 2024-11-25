# myclass

Projeto feito para a materia de Desenvolvimento e Operações na Web apenas para fins de estudo 
Todos os direitos a # https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/


# Iniciar o multipass 
 $multipass launch -n <name_exemplo> jammy

# Entrar no servidor
 $multipass shell <name_exemplo>

# Maquina Web
## Instalar e configurar ngnix
  https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04<br>
  $ sudo apt update<br>
  $ sudo apt install nginx<br>
  $ ufw allow OpenSSH<br>
  $ ufw enable<br>
  $ sudo ufw app list<br>
  $ sudo ufw allow 'Nginx HTTP'<br>
  $ sudo ufw allow 'Nginx HTTPS'<br>
  $ sudo ufw status<br>
  $ sudo systemctl reload nginx<br>
  $ systemctl status nginx<br>

  # Criação do arquivo da pagina
   $ sudo mkdir -p /var/www/myclass.com/html
   # Configuração da rota <br>
   $ sudo nano /etc/nginx/sites-available/myclass.com<br>
       server {<br>
          listen      80;<br>
          listen              443 ssl;<br>
          server_name myclass.com www.myclass.com;<br>
          ssl_certificate    tls/myclass.crt;<br>
          ssl_certificate_key tls/myclass.key;<br>
          ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;<br>
          ssl_ciphers         HIGH:!aNULL:!MD5;        <br>
          root /var/www/myclass.com/html;<br>
          server_name myclass.com www.myclass.com;      <br>
              index index.html;<br>
              location / {<br>
                      try_files $uri $uri/ /index.html =404;<br>
              }<br>
      }<br>
   # Linkar o arquivo de configuração para habilitado   <br>
  $ sudo ln -s /etc/nginx/sites-available/myclass.com /etc/nginx/sites-enabled/<br>

  # Remover linha de comentario em:
  $ sudo nano /etc/nginx/nginx.conf<br>
    server_names_hash_bucket_size 64;<br>
  # Testar nginx <br>
  $ sudo nginx -t<br>
  $ sudo systemctl restart nginx<br>

# Maquina DB 
   https://www.hostinger.com.br/tutoriais/instalar-mongodb-ubuntu <br>
   $ curl -fsSL https://pgp.mongodb.com/server-7.0.asc |  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor<br>
   $ echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list<br>
   $ sudo apt-get update<br>
   # Instalar o mongodb<br>
   $ sudo apt-get install -y mongodb-org<br>
   # Iniciar o servico<br>
   $ sudo systemctl start mongod<br>
   $ sudo systemctl enable mongod<br>
   
  # Criar um novo banco de dados 
  $ mongosh<br>
  $ use classroom <br>
  # Criar um usuario com senha "123"
   $ db.createUser(
       {
         user: "root",
         pwd: "123",   
         roles: [
             { role: 'userAdminAnyDatabase', db: 'admin' },
            { role: 'readWriteAnyDatabase', db: 'admin' }
          ],
       }
    )<br>

  # Testar a conexao de entrada
   $  mongosh --port 27017 -u root -p '123' 'admin'<br>
  # Habilitar conexão remota 
   $ sudo nano /etc/mongod.conf<br>
      bindIp: 127.0.0.1, 10.118.254.138 // ip da maquina dev<br>
      security:   authorization: enabled // alterar para enable <br>
   $ sudo systemctl restart mongod<br>

  // mongo "mongodb://usuário:senha@ip:porta/?authSource=nome_do_banco_de_dados"  link para conexão remota<br>
   
# Maquina Dev<br>
# clone do repositorio 
  git clone https://github.com/emanuel-o-dev/myclass.git<br>
  $ cd myclass/backend <br>
  # Instalar as dependências
  $ npm i <br>
  $ mkdir tls<br>
  $ mkdir .env<br>
  $ sudo nano .env <br>
    // conexão com dns<br>
    MONGODB_URI = mongodb://root:123@db.myclass.com:27017/?directConnection=true&serverSelectionTimeoutMS><br>
    PORT = 4000<br>

## Maquina DNS 
   $sudo apt-get install bind9<br>
     dnssec-validation no;
     allow-query { 127.0.0.0/8; 10.118.254.0/24; }; // ip da bridge da maquina hospodeira<br>
     listen-on-v6 { };<br>
     
     // Se nao souber o IP voltar para a maquina hospedeira e usa o comando 
     // $ ip -br -c a
  $ sudo systemctl restart bind<br>
  # Editar configurações locais<br>
  $ sudo nano /etc/bind/named.conf.local <br>
    zone "myclass.com" IN {
        type master;
        file "db.myclass.com";
    };
  # Criar arquivo de configuração
  $ sudo nano /var/cache/bind/db.myclass.com<br>
    $ORIGIN myclass.com.<br>
    $TTL 300;<br>
    @ IN SOA dns emanueloliveiraandrade.alunos.utpr.edu.br (1 30 30 30 30);<br>
    @ IN NS dns<br>
    dns IN A 10.118.254.54<br>
    ca IN A 10.118.254.2<br>
    db IN A 10.118.254.138<br>
    dev IN A 10.118.254.160<br>
    @ IN A 10.118.254.85<br>
    web IN CNAME @<br>
    www IN CNAME @ <br>
     // usar multipass list para virificar os IPs na sua maquina

## Ajustar DNS na MAQUINA LOCAL
  
  $ sudo nano /etc/systemd/resolved.con<br>
    DNS=[IP-DO-SERVIDOR-DNS]<br>
    FallbackDNS=[IP-DO-GATEWAY-MULTIPASS]<br>
  $ sudo systemctl restart systemd-resolved<br>

## Maquina CA 
  $ sudo apt-get install easy-rsa<br>
  # Copiar a pasta para o home <br>
   $  cp -R /usr/share/easy-rsa/ .<br>
   $ cd easy-rsa/<br>
   $ mv vars.exemple vars<br>
   $ sudo nano vars <br>
     // remover "#" e mudar para <br>
      set_var EASYRSA_DN      "org"<br>
      // mais abaixo <br>
      set_var EASYRSA_REQ_COUNTRY     "US"<br>
      set_var EASYRSA_REQ_PROVINCE    "California"<br>
      set_var EASYRSA_REQ_CITY        "San Francisco"<br>
      set_var EASYRSA_REQ_ORG "CAMADA SA"<br>
      set_var EASYRSA_REQ_EMAIL       "me@camada.net"<br>
      set_var EASYRSA_REQ_OU          "CAMADA SA"<br>
  # Iniciando a CA
  $ ./easy-rsa init-pki <br>
  $ ./easy-rsa build-ca <br>
    // Ele vai pedir uma senha, em ambiente real ela precisa ser muito bem protegida mas como estamos em ambiente<br>
    // de apredizado vamos colocar "123"<br>
   // apos ele vai pedir para confirmar as informações do certificado, em quase todos da pra deixar o padrão apena em <br>
   "Common Name: ..... " : camada.net<br>

  # Instalar um navegador para disponibilizar o certificado pela web<br>
   $ sudo apt-get install lightpd<br>
   $ sudo cp pki/ca.crt /var/www/html/<br>
     # Alterar permissões do arquivo<br>
     // alterar o dono do arquivo para ubuntu (usuario padrão)<br>
     $ sudo chown ubuntu:ubuntu /var/www/html/ca.crt <br>
     // alterar a configurar de leitura do arquivo <br>
     $ sudo chmod 444 /var/www/html/ca.crt <br>
  





   
  
