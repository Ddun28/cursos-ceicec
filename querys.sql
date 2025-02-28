--crear usuario
CREATE ROLE "Lilian" WITH
	LOGIN
	SUPERUSER
	CREATEDB
	CREATEROLE
	INHERIT
	REPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'xxxxxx';

--create database
CREATE DATABASE proyecto3
    WITH
    OWNER = "Lilian"
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;