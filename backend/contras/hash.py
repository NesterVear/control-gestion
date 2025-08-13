import bcrypt

contrasena = input ('Contrasena?: ')
hashed = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())
print(hashed.decode('utf-8'))