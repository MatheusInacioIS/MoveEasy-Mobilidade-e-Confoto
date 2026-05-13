
CREATE DATABASE moveasy;

USE moveasy;

CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  foto VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE linhas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(30),
  tipo VARCHAR(30),
  rota VARCHAR(255),
  tempo VARCHAR(30),
  status_linha VARCHAR(80)
);

CREATE TABLE favoritos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  linha_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (linha_id) REFERENCES linhas(id)
);

CREATE TABLE suporte (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_nome VARCHAR(100),
  email VARCHAR(150),
  tipo VARCHAR(80),
  mensagem TEXT,
  protocolo VARCHAR(20),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO linhas (codigo, tipo, rota, tempo, status_linha) VALUES
('7545-10','Ônibus','Carrão → Arthur Alvim','4 min','No horário'),
('2200-11','Ônibus','Penha → Vila Ré','2 min','Chegando'),
('M1 Azul','Metrô','Jabaquara → Tucuruvi','1 min','Operação normal');
