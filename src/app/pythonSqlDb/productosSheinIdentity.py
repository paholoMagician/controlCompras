import sqlite3

class ProductDB:
    def __init__(self, db_file='shein.db'):
        self.db_file = db_file

    def conectar(self):
        self.conn = sqlite3.connect(self.db_file)
        self.cursor = self.conn.cursor()

    def desconectar(self):
        self.conn.close()

    def crear_producto(self, nombre_usuario, tienda, precio_pvp, precio_pvapp, nombre_producto):
        self.conectar()
        self.cursor.execute("""INSERT INTO productos (nombre_usuario, tienda, precio_pvp, precio_pvapp, nombre_producto)
                               VALUES (?, ?, ?, ?, ?)""", (nombre_usuario, tienda, precio_pvp, precio_pvapp, nombre_producto))
        self.conn.commit()
        self.desconectar()

    def obtener_todos_los_productos(self):
        self.conectar()
        self.cursor.execute("SELECT * FROM productos")
        productos = self.cursor.fetchall()
        self.desconectar()
        return productos


    def actualizar_producto(self, producto_id, nombre_usuario, tienda, precio_pvp, precio_pvapp, nombre_producto):
        self.conectar()
        self.cursor.execute("""UPDATE productos 
                               SET nombre_usuario=?, tienda=?, precio_pvp=?, precio_pvapp=?, nombre_producto=?
                               WHERE id=?""", (nombre_usuario, tienda, precio_pvp, precio_pvapp, nombre_producto, producto_id))
        self.conn.commit()
        self.desconectar()

    def eliminar_producto(self, producto_id):
        self.conectar()
        self.cursor.execute("DELETE FROM productos WHERE id=?", (producto_id,))
        self.conn.commit()
        self.desconectar()